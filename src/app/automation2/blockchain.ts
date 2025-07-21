import { ethers } from 'ethers';

// Contract ABIs
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function transfer(address,uint256) returns (bool)",
  "function deposit() payable",
  "function withdraw(uint256) returns (bool)"
];

const DVM_ROUTER_ABI = [
  {
    "type": "function",
    "name": "addDVMLiquidity",
    "stateMutability": "payable",
    "inputs": [
      {"internalType": "address", "name": "dvmAddress", "type": "address"},
      {"internalType": "uint256", "name": "baseInAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "quoteInAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "baseMinAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "quoteMinAmount", "type": "uint256"},
      {"internalType": "uint8", "name": "flag", "type": "uint8"},
      {"internalType": "uint256", "name": "deadLine", "type": "uint256"}
    ],
    "outputs": [
      {"internalType": "uint256", "name": "shares", "type": "uint256"},
      {"internalType": "uint256", "name": "baseAdjustedInAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "quoteAdjustedInAmount", "type": "uint256"}
    ]
  }
];

// Faroswap contract addresses from farobot.py
export const FARO_CONTRACTS = {
  PHRS: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native PHRS
  WPHRS: "0x3019B247381c850ab53Dc0EE53bCe7A07Ea9155f",
  USDC: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED", 
  USDT: "0xD4071393f8716661958F766DF660033b3d35fD29",
  MIXSWAP_ROUTER: "0x3541423f25A1Ca5C98fdBCf478405d3f0aaD1164",
  DVM_ROUTER: "0x4b177AdEd3b8bD1D5D747F91B9E853513838Cd49",
  POOL_ROUTER: "0x73cafc894dbfc181398264934f7be4e482fc9d40"
};

export const FARO_FIXED_AMOUNTS = {
  PHRS: 0.0005,
  WPHRS: 0.0005,
  USDC: 0.01,
  USDT: 0.01
};

const RPC_URL = "https://api.zan.top/node/v1/pharos/testnet/54b49326c9f44b6e8730dc5dd4348421";

// Pool pairs from pools.json structure (would be loaded dynamically in real implementation)
// TODO: Replace with real DVM pool addresses from Faroswap
const POOL_PAIRS = {
  "USDC_USDT": "0x00682414d7503ed90859d44d6b4c9f95b06a919b", // Real DVM pool address needed
  "USDT_USDC": "0x4bb7f80104f636938fb32d935866c7dfbb5a80ba"  // Real DVM pool address needed
};

// Generate random wallet address
export function generateRandomAddress(): string {
  const randomWallet = ethers.Wallet.createRandom();
  return randomWallet.address;
}

// Get provider and signer
export function getProviderAndSigner(privateKey: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(privateKey, provider);
  return { provider, signer };
}

// Get token balance
export async function getTokenBalance(
  tokenAddress: string, 
  walletAddress: string, 
  provider: ethers.JsonRpcProvider
): Promise<number> {
  try {
    if (tokenAddress === "PHRS" || tokenAddress === FARO_CONTRACTS.PHRS) {
      const balance = await provider.getBalance(walletAddress);
      return parseFloat(ethers.formatEther(balance));
    }
    
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const [balance, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals()
    ]);
    
    return parseFloat(ethers.formatUnits(balance, decimals));
  } catch (error) {
    console.error('Balance check failed:', error);
    return 0;
  }
}

// Approve token for Faroswap
export async function approveFaroToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: number,
  signer: ethers.Wallet
): Promise<ethers.TransactionResponse | null> {
  try {
    console.log(`Approving Faroswap token ${tokenAddress} for ${spenderAddress}`);
    
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    
    const timeoutPromise = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };
    
    const decimals = await timeoutPromise(contract.decimals(), 30000);
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    const currentAllowance = await timeoutPromise(
      contract.allowance(signer.address, spenderAddress), 
      30000
    );
    
    if (currentAllowance < amountWei) {
      const maxAmount = ethers.MaxUint256;
      
      const gasEstimate = await timeoutPromise(
        contract.approve.estimateGas(spenderAddress, maxAmount),
        30000
      );
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
      
      const provider = signer.provider;
      if (!provider) throw new Error('Provider not available');
      const nonce = await provider.getTransactionCount(signer.address, 'pending');
      
      const tx = await contract.approve(spenderAddress, maxAmount, { gasLimit, nonce });
      const receipt = await timeoutPromise(tx.wait(), 300000);
      console.log(`Approve transaction confirmed in block ${(receipt as { blockNumber?: number })?.blockNumber}`);
      
      return tx;
    }
    
    return null; // Already approved
  } catch (error) {
    console.error('Token approval failed:', error);
    throw error;
  }
}

// Perform PHRS transfer (same as Zenith)
export async function performTransfer(
  recipientAddress: string,
  amount: number,
  signer: ethers.Wallet
): Promise<{ hash: string; blockNumber: number | null }> {
  try {
    console.log(`Starting PHRS transfer to ${recipientAddress} amount: ${amount}`);
    
    const amountWei = ethers.parseEther(amount.toString());
    
    const timeoutPromise = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };
    
    const provider = signer.provider;
    if (!provider) throw new Error('Provider not available');
    
    const nonce = await timeoutPromise(
      provider.getTransactionCount(signer.address, 'pending'), 
      30000
    );
    
    const feeData = await timeoutPromise(provider.getFeeData(), 30000);
    
    const txParams = {
      to: recipientAddress,
      value: amountWei,
      gasLimit: 21000,
      nonce: nonce,
      maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('2', 'gwei'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('1', 'gwei')
    };
    
    const tx = await timeoutPromise(signer.sendTransaction(txParams), 60000);
    
    try {
      const receipt = await timeoutPromise(tx.wait(), 120000);
      return {
        hash: tx.hash,
        blockNumber: receipt?.blockNumber || null
      };
    } catch {
      return {
        hash: tx.hash,
        blockNumber: null
      };
    }
  } catch (error: unknown) {
    console.error('Transfer failed:', error);
    throw error;
  }
}

// Get Dodo route for Faroswap (mimicking farobot.py get_dodo_route)
async function getDodoRoute(
  walletAddress: string,
  fromToken: string, 
  toToken: string, 
  amount: string
): Promise<any> {
  try {
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const url = `https://api.dodoex.io/route-service/v2/widget/getdodoroute?chainId=688688&deadLine=${deadline}&apikey=a37546505892e1a952&slippage=3.225&source=dodoV2AndMixWasm&toTokenAddress=${toToken}&fromTokenAddress=${fromToken}&userAddr=${walletAddress}&estimateGas=true&fromAmount=${amount}`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Origin": "https://faroswap.xyz",
        "Referer": "https://faroswap.xyz/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.status !== 200) {
      throw new Error(result.data || "Quote not available");
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get Dodo route:', error);
    throw error;
  }
}

// Perform Faroswap swap using MixSwap router
export async function performFaroSwap(
  fromToken: string,
  toToken: string,
  amount: number,
  signer: ethers.Wallet
): Promise<{ hash: string; blockNumber: number | null }> {
  try {
    // Improved: Check balance and approve with buffer for WPHRS swaps
    if (fromToken !== FARO_CONTRACTS.PHRS) {
      const contract = new ethers.Contract(fromToken, ERC20_ABI, signer);
      const decimals = await contract.decimals();
      const balance = await contract.balanceOf(signer.address);
      const balanceFormatted = parseFloat(ethers.formatUnits(balance, decimals));
      if (balanceFormatted < amount) {
        throw new Error(`Insufficient balance for swap. Have: ${balanceFormatted}, Need: ${amount}`);
      }
      // Approve with buffer
      await approveFaroToken(fromToken, FARO_CONTRACTS.MIXSWAP_ROUTER, amount * 2, signer);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Get token decimals
    let decimals = 18; // Default for PHRS
    if (fromToken !== FARO_CONTRACTS.PHRS) {
      const contract = new ethers.Contract(fromToken, ERC20_ABI, signer);
      decimals = await contract.decimals();
    }
    
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    // Get swap route from Dodo API
    const dodoRoute = await getDodoRoute(signer.address, fromToken, toToken, amountWei.toString());
    
    if (!dodoRoute || !dodoRoute.data) {
      throw new Error("Failed to get swap route");
    }
    
    const value = dodoRoute.data.value || "0";
    const calldata = dodoRoute.data.data;
    const gasLimit = dodoRoute.data.gasLimit || 300000;
    
    const provider = signer.provider;
    if (!provider) throw new Error('Provider not available');
    
    const nonce = await provider.getTransactionCount(signer.address, 'pending');
    const feeData = await provider.getFeeData();
    
    const swapTx = {
      to: FARO_CONTRACTS.MIXSWAP_ROUTER,
      from: signer.address,
      data: calldata,
      value: parseInt(value),
      gasLimit: parseInt(gasLimit.toString()),
      maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('2', 'gwei'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('1', 'gwei'),
      nonce: nonce
    };
    
    const tx = await signer.sendTransaction(swapTx);
    const receipt = await tx.wait();
    
    return {
      hash: tx.hash,
      blockNumber: receipt?.blockNumber || null
    };
  } catch (error) {
    console.error('Faroswap swap failed:', error);
    throw error;
  }
}

// Add DVM liquidity to Faroswap
export async function addFaroLiquidity(
  pairAddress: string,
  baseToken: string,
  quoteToken: string,
  amount: number,
  signer: ethers.Wallet
): Promise<{ hash: string; blockNumber: number | null }> {
  try {
    // Check if we have a valid pool address
    if (!pairAddress || pairAddress === "") {
      throw new Error("DVM pool address not available. Please provide real pool addresses.");
    }
    
    // Get token decimals (assuming 6 decimals for USDC/USDT)
    const decimals = 6;
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    const minAmount = ethers.parseUnits((amount * 0.999).toString(), decimals); // 0.1% slippage
    
    // Approve both tokens
    await approveFaroToken(baseToken, FARO_CONTRACTS.POOL_ROUTER, amount, signer);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await approveFaroToken(quoteToken, FARO_CONTRACTS.POOL_ROUTER, amount, signer);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add DVM liquidity
    const dvmRouter = new ethers.Contract(
      FARO_CONTRACTS.DVM_ROUTER,
      DVM_ROUTER_ABI,
      signer
    );
    
    const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes
    
    const gasEstimate = await dvmRouter.addDVMLiquidity.estimateGas(
      pairAddress,
      amountWei,
      amountWei,
      minAmount,
      minAmount,
      0,
      deadline,
      { value: 0 }
    );
    
    const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
    
    const provider = signer.provider;
    if (!provider) throw new Error('Provider not available');
    const nonce = await provider.getTransactionCount(signer.address, 'pending');
    const feeData = await provider.getFeeData();
    
    const tx = await dvmRouter.addDVMLiquidity(
      pairAddress,
      amountWei,
      amountWei,
      minAmount,
      minAmount,
      0,
      deadline,
      {
        gasLimit,
        nonce,
        value: 0,
        maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('2', 'gwei'),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('1', 'gwei')
      }
    );
    
    const receipt = await tx.wait();
    
    return {
      hash: tx.hash,
      blockNumber: receipt?.blockNumber || null
    };
  } catch (error) {
    console.error('Add Faroswap DVM liquidity failed:', error);
    throw error;
  }
}

// Generate Faroswap swap pairs
export function getFaroSwapPairs(): Array<{
  fromToken: string;
  toToken: string;
  amount: number;
  fromTicker: string;
  toTicker: string;
}> {
  const tickers = ["PHRS", "WPHRS", "USDC", "USDT"];
  
  // Generate all valid pairs (excluding PHRS <-> WPHRS)
  const pairs = [];
  for (const fromTicker of tickers) {
    for (const toTicker of tickers) {
      if (fromTicker !== toTicker && 
          !((fromTicker === "PHRS" && toTicker === "WPHRS") || 
            (fromTicker === "WPHRS" && toTicker === "PHRS"))) {
        
        const fromToken = fromTicker === "PHRS" ? FARO_CONTRACTS.PHRS : FARO_CONTRACTS[fromTicker as keyof typeof FARO_CONTRACTS];
        const toToken = toTicker === "PHRS" ? FARO_CONTRACTS.PHRS : FARO_CONTRACTS[toTicker as keyof typeof FARO_CONTRACTS];
        const amount = FARO_FIXED_AMOUNTS[fromTicker as keyof typeof FARO_FIXED_AMOUNTS];
        
        pairs.push({
          fromToken,
          toToken,
          amount,
          fromTicker,
          toTicker
        });
      }
    }
  }
  
  return pairs;
}

// Generate Faroswap liquidity pairs (DVM pools)
export function getFaroLiquidityPairs(): Array<{
  pairAddress: string;
  baseToken: string;
  quoteToken: string;
  baseTicker: string;
  quoteTicker: string;
  amount: number;
}> {
  const pairs = [];
  
  // Only return pairs if we have valid pool addresses
  if (POOL_PAIRS.USDC_USDT && POOL_PAIRS.USDC_USDT !== "") {
    pairs.push({
      pairAddress: POOL_PAIRS.USDC_USDT,
      baseToken: FARO_CONTRACTS.USDC,
      quoteToken: FARO_CONTRACTS.USDT,
      baseTicker: "USDC",
      quoteTicker: "USDT",
      amount: FARO_FIXED_AMOUNTS.USDC
    });
  }
  
  if (POOL_PAIRS.USDT_USDC && POOL_PAIRS.USDT_USDC !== "") {
    pairs.push({
      pairAddress: POOL_PAIRS.USDT_USDC,
      baseToken: FARO_CONTRACTS.USDT,
      quoteToken: FARO_CONTRACTS.USDC,
      baseTicker: "USDT",
      quoteTicker: "USDC", 
      amount: FARO_FIXED_AMOUNTS.USDT
    });
  }
  
  return pairs;
} 