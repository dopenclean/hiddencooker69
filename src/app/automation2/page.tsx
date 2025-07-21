'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import './automation.css';
import {
  getProviderAndSigner,
  generateRandomAddress,
  performTransfer,
  addFaroLiquidity,
  performFaroSwap,
  getFaroLiquidityPairs,
  getFaroSwapPairs,
  getTokenBalance,
  FARO_CONTRACTS,
  FARO_FIXED_AMOUNTS
} from './blockchain';
import { checkAuthSession, clearAuthSession } from '../utils/auth';

// Types
interface WalletInfo {
  address: string;
  privateKey: string;
}

interface TransactionCounts {
  transfers: number;
  liquidity: number;
  swaps: number;
}

interface ProxySettings {
  type: 'free' | 'custom' | 'none';
  rotate: boolean;
}

interface TokenBalance {
  phrs: number;
  wphrs: number;
  usdc: number;
  usdt: number;
}

interface CostCalculation {
  phrs: number;
  wphrs: number;
  usdc: number;
  usdt: number;
}

const RPC_URL = "https://api.zan.top/node/v1/pharos/testnet/54b49326c9f44b6e8730dc5dd4348421";

export default function AutomationPage() {
  const router = useRouter();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [transactionCounts, setTransactionCounts] = useState<TransactionCounts>({
    transfers: 0,
    liquidity: 0,
    swaps: 0
  });
  const [, setProxySettings] = useState<ProxySettings>({
    type: 'none',
    rotate: false
  });
  const [balances, setBalances] = useState<TokenBalance | null>(null);
  const [costs, setCosts] = useState<CostCalculation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Form states
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [transferCount, setTransferCount] = useState('');
  const [liquidityCount, setLiquidityCount] = useState('');
  const [swapCount, setSwapCount] = useState('');
  const [error, setError] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Session ID for concurrent users
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isValid = checkAuthSession();
      setIsAuthenticated(isValid);
      setIsCheckingAuth(false);
      
      if (!isValid) {
        router.push('/');
      }
    };

    checkAuth();
    const authInterval = setInterval(checkAuth, 60000);
    return () => clearInterval(authInterval);
  }, [router]);

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => {
      const newLogs = [...prev, `[${timestamp}] ${message}`];
      setTimeout(() => {
        const logsContainer = document.querySelector('.logs');
        if (logsContainer) {
          logsContainer.scrollTop = logsContainer.scrollHeight;
        }
      }, 100);
      return newLogs;
    });
  };

  // Render log entry with clickable links
  const renderLogEntry = (log: string, index: number) => {
    const explorerMatch = log.match(/(https:\/\/testnet\.pharosscan\.xyz\/tx\/0x[a-fA-F0-9]+)/);
    
    if (explorerMatch) {
      const url = explorerMatch[1];
      const beforeUrl = log.substring(0, log.indexOf(url));
      const afterUrl = log.substring(log.indexOf(url) + url.length);
      
      return (
        <div key={index} className="log-entry">
          {beforeUrl}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="log-link"
          >
            {url}
          </a>
          {afterUrl}
        </div>
      );
    }
    
    return (
      <div key={index} className="log-entry">
        {log}
      </div>
    );
  };

  // Generate wallet from private key
  const generateWallet = (privateKey: string): WalletInfo | null => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return {
        address: wallet.address,
        privateKey: privateKey
      };
    } catch {
      return null;
    }
  };

  // Get token balance helper
  const getTokenBalanceHelper = async (tokenAddress: string, walletAddress: string): Promise<number> => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    return await getTokenBalance(tokenAddress, walletAddress, provider);
  };

  // Calculate costs for Faroswap
  const _calculateCosts = (counts: TransactionCounts): CostCalculation => {
    // Transfer costs (same PHRS transfers to friends)
    const phrsFromTransfers = counts.transfers * FARO_FIXED_AMOUNTS.PHRS;
    
    // Liquidity costs for Faroswap DVM pairs (if pool addresses are available)
    const availablePairs = getFaroLiquidityPairs().length;
    let usdcFromLp = 0;
    let usdtFromLp = 0;
    
    if (availablePairs > 0) {
      const lpPerPair = Math.floor(counts.liquidity / availablePairs);
      const lpRemainder = counts.liquidity % availablePairs;
      
      usdcFromLp = (lpPerPair * 2 + Math.min(lpRemainder, 1)) * FARO_FIXED_AMOUNTS.USDC;
      usdtFromLp = (lpPerPair * 2 + Math.max(0, lpRemainder)) * FARO_FIXED_AMOUNTS.USDT;
    }
    
    // Swap costs (PHRS, WPHRS, USDC, USDT swaps only - 10 valid pairs)
    const swapPerType = Math.floor(counts.swaps / 10);
    const swapRemainder = counts.swaps % 10;
    
    let phrsFromSwap = swapPerType * 2 * FARO_FIXED_AMOUNTS.PHRS; // PHRS can swap to USDC and USDT
    let wphrsFromSwap = swapPerType * 3 * FARO_FIXED_AMOUNTS.WPHRS; // WPHRS can swap to USDC, USDT
    let usdcFromSwap = swapPerType * 3 * FARO_FIXED_AMOUNTS.USDC; // USDC can swap to WPHRS, USDT
    let usdtFromSwap = swapPerType * 3 * FARO_FIXED_AMOUNTS.USDT; // USDT can swap to WPHRS, USDC
    
    // Add remainder swaps (distribute evenly)
    if (swapRemainder > 0) usdcFromSwap += FARO_FIXED_AMOUNTS.USDC; // USDC->WPHRS
    if (swapRemainder > 1) usdcFromSwap += FARO_FIXED_AMOUNTS.USDC; // USDC->USDT
    if (swapRemainder > 2) usdtFromSwap += FARO_FIXED_AMOUNTS.USDT; // USDT->WPHRS
    if (swapRemainder > 3) usdtFromSwap += FARO_FIXED_AMOUNTS.USDT; // USDT->USDC
    if (swapRemainder > 4) wphrsFromSwap += FARO_FIXED_AMOUNTS.WPHRS; // WPHRS->USDC
    if (swapRemainder > 5) wphrsFromSwap += FARO_FIXED_AMOUNTS.WPHRS; // WPHRS->USDT
    if (swapRemainder > 6) phrsFromSwap += FARO_FIXED_AMOUNTS.PHRS; // PHRS->USDC
    if (swapRemainder > 7) phrsFromSwap += FARO_FIXED_AMOUNTS.PHRS; // PHRS->USDT

    // Gas buffer
    const gasBuffer = (counts.transfers + counts.liquidity + counts.swaps) * 0.001;

    return {
      phrs: phrsFromTransfers + phrsFromSwap + gasBuffer,
      wphrs: wphrsFromSwap,
      usdc: usdcFromLp + usdcFromSwap,
      usdt: usdtFromLp + usdtFromSwap
    };
  };

  // Step handlers
  const handlePrivateKeySubmit = () => {
    if (!privateKeyInput.trim()) {
      setError('Please enter your private key');
      return;
    }

    const walletInfo = generateWallet(privateKeyInput.trim());
    if (!walletInfo) {
      setError('Invalid private key');
      return;
    }

    setWallet(walletInfo);
    setError('');
    setCurrentStep(1);
  };

  const handleTransferCountSubmit = () => {
    const count = parseInt(transferCount);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid number (0 or positive)');
      return;
    }

    setTransactionCounts(prev => ({ ...prev, transfers: count }));
    setError('');
    setCurrentStep(2);
  };

  const handleLiquidityCountSubmit = () => {
    const count = parseInt(liquidityCount);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid number (0 or positive)');
      return;
    }

    setTransactionCounts(prev => ({ ...prev, liquidity: count }));
    setError('');
    setCurrentStep(3);
  };

  const handleSwapCountSubmit = () => {
    const count = parseInt(swapCount);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid number (0 or positive)');
      return;
    }

    setTransactionCounts(prev => ({ ...prev, swaps: count }));
    setError('');
    setCurrentStep(4);
  };

  const handleProxySelection = (type: 'free' | 'custom' | 'none') => {
    if (type === 'none') {
      setProxySettings({ type, rotate: false });
      setCurrentStep(5);
    } else {
      setProxySettings(prev => ({ ...prev, type }));
      setCurrentStep(4.5);
    }
  };

  const handleRotateSelection = (rotate: boolean) => {
    setProxySettings(prev => ({ ...prev, rotate }));
    setCurrentStep(5);
  };

  const checkSufficientBalance = (): boolean => {
    if (!balances || !costs) return false;

    return (
      balances.phrs >= costs.phrs &&
      balances.wphrs >= costs.wphrs &&
      balances.usdc >= costs.usdc &&
      balances.usdt >= costs.usdt
    );
  };

  const startAutomation = async () => {
    if (!wallet) return;
    
    setIsProcessing(true);
    setCurrentStep(7);
    addLog("🚀 Starting Faroswap automation process...");
    addLog(`📧 Session ID: ${sessionId}`);
    addLog(`👛 Wallet: ${wallet.address}`);
    
    const automationTimeout = setTimeout(() => {
      addLog("⏰ Automation timed out after 30 minutes");
      setIsProcessing(false);
    }, 30 * 60 * 1000);
    
    try {
      const { provider, signer } = getProviderAndSigner(wallet.privateKey);
      
      addLog("🔍 Testing Faroswap network connectivity...");
      try {
        const blockNumber = await provider.getBlockNumber();
        addLog(`✅ Connected to Pharos network (block ${blockNumber})`);
        
        const balance = await provider.getBalance(wallet.address);
        const balanceEth = parseFloat(ethers.formatEther(balance));
        addLog(`💰 Current balance: ${balanceEth.toFixed(6)} PHRS`);
        
        if (balanceEth < 0.001) {
          addLog("⚠️ Warning: Very low balance, transactions may fail");
        }
      } catch (networkError) {
        addLog(`❌ Network connectivity failed: ${networkError}`);
        throw new Error("Network connectivity issue");
      }
      
      // Execute transfers (same as Zenith)
      if (transactionCounts.transfers > 0) {
        addLog("=== FRIEND TRANSFERS ===");
        for (let i = 0; i < transactionCounts.transfers; i++) {
          addLog(`Transfer ${i + 1}/${transactionCounts.transfers}`);
          
          const receiver = generateRandomAddress();
          addLog(`     To: ${receiver.slice(0, 6)}...${receiver.slice(-6)}`);
          addLog(`     Amount: ${FARO_FIXED_AMOUNTS.PHRS} PHRS`);
          addLog(`     🔄 Preparing transaction...`);
          
          try {
            const result = await performTransfer(receiver, FARO_FIXED_AMOUNTS.PHRS, signer);
            addLog(`     🔗 Explorer: https://testnet.pharosscan.xyz/tx/${result.hash}`);
            
            if (result.blockNumber) {
              addLog(`     ✅ Transfer confirmed in block ${result.blockNumber}`);
            } else {
              addLog(`     ✅ Transfer sent (confirmation pending)`);
            }
            addLog(`     📋 Hash: ${result.hash}`);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            addLog(`     ❌ Transfer failed: ${errorMessage}`);
            addLog(`     ⏭️ Continuing to next transfer...`);
          }
          
          if (i < transactionCounts.transfers - 1) {
            addLog(`     ⏳ Waiting 5 seconds before next transfer...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
      
      // Execute Faroswap liquidity additions
      if (transactionCounts.liquidity > 0) {
        addLog("=== ADD FAROSWAP LIQUIDITY ===");
        const liquidityPairs = getFaroLiquidityPairs();
        
        if (liquidityPairs.length === 0) {
          addLog("⚠️ No DVM pool addresses available. Skipping liquidity operations.");
          addLog("📝 To enable liquidity: provide real Faroswap DVM pool addresses in blockchain.ts");
        } else {
          for (let i = 0; i < transactionCounts.liquidity; i++) {
            addLog(`Liquidity ${i + 1}/${transactionCounts.liquidity}`);
            
            const pair = liquidityPairs[i % liquidityPairs.length];
            addLog(`     Pair: ${pair.baseTicker}/${pair.quoteTicker}`);
            addLog(`     Amount: ${pair.amount} ${pair.baseTicker} + ${pair.amount} ${pair.quoteTicker}`);
            
            try {
              addLog(`     🔄 Starting Faroswap DVM liquidity addition...`);
              
              const result = await addFaroLiquidity(
                pair.pairAddress,
                pair.baseToken, 
                pair.quoteToken, 
                pair.amount,
                signer
              );
              addLog(`     ✅ Liquidity added to DVM pool successfully`);
              addLog(`     Hash: ${result.hash}`);
              addLog(`     Block: ${result.blockNumber}`);
              addLog(`     Explorer: https://testnet.pharosscan.xyz/tx/${result.hash}`);
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              addLog(`     ❌ Add DVM liquidity failed: ${errorMessage}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
      
      // Execute Faroswap swaps
      if (transactionCounts.swaps > 0) {
        addLog("=== FAROSWAP SWAPS ===");
        const swapPairs = getFaroSwapPairs();
        
        for (let i = 0; i < transactionCounts.swaps; i++) {
          addLog(`Swap ${i + 1}/${transactionCounts.swaps}`);
          
          const pair = swapPairs[i % swapPairs.length];
          addLog(`     Swap: ${pair.fromTicker} → ${pair.toTicker}`);
          addLog(`     Amount: ${pair.amount} ${pair.fromTicker}`);
          
          try {
            const result = await performFaroSwap(
              pair.fromToken, 
              pair.toToken, 
              pair.amount, 
              signer
            );
            addLog(`     ✅ Faroswap swap successful`);
            addLog(`     Hash: ${result.hash}`);
            addLog(`     Block: ${result.blockNumber}`);
            addLog(`     Explorer: https://testnet.pharosscan.xyz/tx/${result.hash}`);
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            addLog(`     ❌ Faroswap swap failed: ${errorMessage}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      addLog("🎉 All Faroswap operations completed successfully!");
      clearTimeout(automationTimeout);
      setIsProcessing(false);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Faroswap automation failed: ${errorMessage}`);
      clearTimeout(automationTimeout);
      setIsProcessing(false);
    }
  };

  // Check balances function
  const checkBalances = useCallback(async (walletAddress: string) => {
    try {
      const [phrsBalance, wphrsBalance, usdcBalance, usdtBalance] = await Promise.all([
        getTokenBalanceHelper("PHRS", walletAddress),
        getTokenBalanceHelper(FARO_CONTRACTS.WPHRS, walletAddress),
        getTokenBalanceHelper(FARO_CONTRACTS.USDC, walletAddress),
        getTokenBalanceHelper(FARO_CONTRACTS.USDT, walletAddress)
      ]);

      return {
        phrs: phrsBalance,
        wphrs: wphrsBalance,
        usdc: usdcBalance,
        usdt: usdtBalance
      };
    } catch (error) {
      console.error('Balance check failed:', error);
      return {
        phrs: 0,
        wphrs: 0,
        usdc: 0,
        usdt: 0
      };
    }
  }, []);

  // Auto-calculate costs and check balances when reaching step 5
  useEffect(() => {
    const calculateCostsAndCheckBalance = async () => {
      if (!wallet) return;

      try {
        const transactionCounts = {
          transfers: parseFloat(transferCount) || 0,
          liquidity: parseFloat(liquidityCount) || 0,
          swaps: parseFloat(swapCount) || 0
        };

        const costs = _calculateCosts(transactionCounts);
        setCosts(costs);

        const balanceResults = await checkBalances(wallet.address);
        setBalances(balanceResults);

        setTimeout(() => {
          setCurrentStep(6);
        }, 2000);
      } catch (error) {
        console.error('Cost calculation or balance check failed:', error);
        setTimeout(() => {
          setCurrentStep(6);
        }, 2000);
      }
    };

    if (currentStep === 5) {
      calculateCostsAndCheckBalance();
    }
  }, [currentStep, wallet, transferCount, liquidityCount, swapCount, checkBalances]);

  // Logout function
  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-container">
            <h2>Enter your wallet private key</h2>
            <input
              type="password"
              className="input"
              placeholder="Private Key"
              value={privateKeyInput}
              onChange={(e) => {
                setPrivateKeyInput(e.target.value);
                setError('');
              }}
            />
            {error && <div className="error">{error}</div>}
            <button onClick={handlePrivateKeySubmit} className="button">
              Next
            </button>
          </div>
        );

      case 1:
        return (
          <div className="step-container">
            <h2>How many friend transfers?</h2>
            <input
              type="number"
              className="input"
              placeholder="Number of transfers"
              value={transferCount}
              onChange={(e) => {
                setTransferCount(e.target.value);
                setError('');
              }}
              min="0"
            />
            {error && <div className="error">{error}</div>}
            <button onClick={handleTransferCountSubmit} className="button">
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="step-container">
            <h2>How many add liquidity transactions?</h2>
            <input
              type="number"
              className="input"
              placeholder="Number of liquidity transactions"
              value={liquidityCount}
              onChange={(e) => {
                setLiquidityCount(e.target.value);
                setError('');
              }}
              min="0"
            />
            {error && <div className="error">{error}</div>}
            <button onClick={handleLiquidityCountSubmit} className="button">
              Next
            </button>
          </div>
        );

      case 3:
        return (
          <div className="step-container">
            <h2>How many swap transactions?</h2>
            <input
              type="number"
              className="input"
              placeholder="Number of swap transactions"
              value={swapCount}
              onChange={(e) => {
                setSwapCount(e.target.value);
                setError('');
              }}
              min="0"
            />
            {error && <div className="error">{error}</div>}
            <button onClick={handleSwapCountSubmit} className="button">
              Next
            </button>
          </div>
        );

      case 4:
        return (
          <div className="step-container">
            <h2>Proxy Settings</h2>
            <div className="button-group">
              <button
                onClick={() => handleProxySelection('free')}
                className="button secondary"
              >
                Use Free Proxyscrape proxy
              </button>
              <button
                onClick={() => handleProxySelection('custom')}
                className="button secondary"
              >
                Use custom proxy
              </button>
              <button
                onClick={() => handleProxySelection('none')}
                className="button secondary"
              >
                No proxy
              </button>
            </div>
          </div>
        );

      case 4.5:
        return (
          <div className="step-container">
            <h2>Rotate invalid proxy?</h2>
            <div className="button-group">
              <button
                onClick={() => handleRotateSelection(true)}
                className="button secondary"
              >
                YES
              </button>
              <button
                onClick={() => handleRotateSelection(false)}
                className="button secondary"
              >
                NO
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-container">
            <h2>Cost Calculation & Balance Check</h2>
            <div className="cost-breakdown">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 15px auto' }}></div>
                <h3>Calculating costs and checking balances...</h3>
                <p>Please wait while we calculate the required costs and check your wallet balance.</p>
                <p style={{ fontSize: '14px', color: '#888', marginTop: '15px' }}>
                  This will take a few seconds...
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        const hasSufficientBalance = checkSufficientBalance();
        return (
          <div className="step-container">
            <h2>Cost Calculation</h2>
            <div className="cost-breakdown">
              <h3>Transaction Summary:</h3>
              <ul>
                <li>Friend Transfers: {transactionCounts.transfers}</li>
                <li>Add Liquidity: {transactionCounts.liquidity}</li>
                <li>Swaps: {transactionCounts.swaps}</li>
              </ul>
              
              <h3>Required Tokens:</h3>
              <div className="balance-comparison">
                <div className={`balance-item ${balances && costs && balances.phrs >= costs.phrs ? 'sufficient' : 'insufficient'}`}>
                  <span>PHRS: {costs?.phrs.toFixed(4)} (Balance: {balances?.phrs.toFixed(4)})</span>
                </div>
                <div className={`balance-item ${balances && costs && balances.wphrs >= costs.wphrs ? 'sufficient' : 'insufficient'}`}>
                  <span>WPHRS: {costs?.wphrs.toFixed(4)} (Balance: {balances?.wphrs.toFixed(4)})</span>
                </div>
                <div className={`balance-item ${balances && costs && balances.usdc >= costs.usdc ? 'sufficient' : 'insufficient'}`}>
                  <span>USDC: {costs?.usdc.toFixed(4)} (Balance: {balances?.usdc.toFixed(4)})</span>
                </div>
                <div className={`balance-item ${balances && costs && balances.usdt >= costs.usdt ? 'sufficient' : 'insufficient'}`}>
                  <span>USDT: {costs?.usdt.toFixed(4)} (Balance: {balances?.usdt.toFixed(4)})</span>
                </div>
              </div>
              
              {!hasSufficientBalance && (
                <div className="warning">
                  ⚠️ Insufficient balance for one or more tokens. Please ensure you have enough tokens before proceeding.
                </div>
              )}
              
              {hasSufficientBalance && (
                <div className="success-container">
                  <div className="success">🎉 You are ready to go!</div>
                  <div className="button-group">
                    <button onClick={startAutomation} className="button">
                      Let&apos;s Go
                    </button>
                    <button onClick={() => setCurrentStep(0)} className="button secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="automation-container">
            <div className="warning-header">
              {isProcessing && <div className="loading-spinner"></div>}
              ⚠️ Don&apos;t close the browser until it&apos;s finished
            </div>
            <div className="logs-container">
              <h3>Live Logs:</h3>
              <div className="logs">
                {logs.map((log, index) => renderLogEntry(log, index))}
              </div>
              {isProcessing && (
                <div className="automation-controls">
                  <button 
                    onClick={() => {
                      addLog("⏹️ Automation stopped by user");
                      setIsProcessing(false);
                    }}
                    className="button secondary"
                    style={{ marginTop: '15px' }}
                  >
                    Stop Automation
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="automation-page">
        <div className="header">
          <h1>Faroswap Network Automation</h1>
        </div>
        <div className="content">
          <div className="step-container">
            <h2>🔐 Checking authentication...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="automation-page">
      {/* Header */}
      <div className="header">
        <h1>Faroswap Network Automation</h1>
      </div>

      {/* Main Content */}
      <div className="content">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-links">
          <button
            onClick={() => setShowPrivacy(true)}
            className="footer-link"
          >
            Privacy
          </button>
          <button
            onClick={() => setShowHowItWorks(true)}
            className="footer-link"
          >
            How it works
          </button>
          <button
            onClick={handleLogout}
            className="footer-link logout"
            title="Session expires in 24h"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="modal-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Privacy Policy</h2>
            <div className="modal-content">
              <p>
                At Faroswap Network Automation, we take your privacy and security seriously. 
                Here&apos;s what you need to know about how we handle your information:
              </p>
              <h3>Your Wallet Security</h3>
              <p>
                • We never store your private keys on our servers<br/>
                • All operations are performed in your browser session only<br/>
                • Your private key is used temporarily for transaction signing and then discarded<br/>
                • We don&apos;t have any database or permanent storage system
              </p>
              <h3>Session-Based Processing</h3>
              <p>
                • Each user gets a unique session ID for concurrent usage<br/>
                • Sessions are temporary and expire when you close the browser<br/>
                • No personal data is collected or transmitted to external services
              </p>
              <h3>Transaction Privacy</h3>
              <p>
                • All transactions are performed directly on the blockchain<br/>
                • We don&apos;t monitor or log your transaction activities<br/>
                • Your wallet interactions remain completely private
              </p>
              <p className="emphasis">
                Your security is our top priority. This tool operates entirely client-side 
                to ensure maximum privacy and security for your assets.
              </p>
            </div>
            <button onClick={() => setShowPrivacy(false)} className="button">
              Close
            </button>
          </div>
        </div>
      )}

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="modal-overlay" onClick={() => setShowHowItWorks(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>How Faroswap Works</h2>
            <div className="modal-content">
              <h3>Step-by-Step Process</h3>
              <ol>
                <li><strong>Wallet Connection:</strong> Enter your private key to generate wallet address</li>
                <li><strong>Transaction Configuration:</strong> Set how many transactions you want for each type</li>
                <li><strong>Proxy Settings:</strong> Choose your preferred proxy configuration</li>
                <li><strong>Balance Verification:</strong> System checks if you have sufficient tokens</li>
                <li><strong>Automated Execution:</strong> Transactions are executed automatically on Faroswap</li>
              </ol>
              
              <h3>Fixed Transaction Amounts</h3>
              <p>To ensure consistency with Faroswap, we use these fixed amounts:</p>
              <ul>
                <li><strong>PHRS Transfers:</strong> 0.0005 PHRS per transaction</li>
                <li><strong>USDC Operations:</strong> 0.01 USDC per transaction</li>
                <li><strong>USDT Operations:</strong> 0.01 USDT per transaction</li>
                <li><strong>WPHRS Operations:</strong> 0.0005 WPHRS per transaction</li>
              </ul>
              
              <h3>Transaction Types</h3>
              <p><strong>Friend Transfers:</strong> Send PHRS to randomly generated addresses</p>
              <p><strong>Add Liquidity:</strong> Add liquidity to Faroswap DVM pools (primarily USDC/USDT)</p>
              <p><strong>Swaps:</strong> Perform token swaps using Faroswap MixSwap router across multiple pairs</p>
              
              <h3>Faroswap Features</h3>
              <ul>
                <li>DVM (Decentralized Virtual Machine) liquidity pools</li>
                <li>MixSwap router for optimal swap routing</li>
                <li>Support for 4 different tokens (PHRS, WPHRS, USDC, USDT)</li>
                <li>Real-time transaction monitoring with Pharos explorer links</li>
              </ul>
            </div>
            <button onClick={() => setShowHowItWorks(false)} className="button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 