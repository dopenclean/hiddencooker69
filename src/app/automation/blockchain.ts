import { ethers } from 'ethers';

// Contract ABIs
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function transfer(address,uint256) returns (bool)"
];

const SWAP_ROUTER_ABI = [
  "function multicall(uint256 deadline, bytes[] calldata data) external"
];

const POSITION_MANAGER_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "token0", "type": "address" },
          { "internalType": "address", "name": "token1", "type": "address" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "int24", "name": "tickLower", "type": "int24" },
          { "internalType": "int24", "name": "tickUpper", "type": "int24" },
          { "internalType": "uint256", "name": "amount0Desired", "type": "uint256" },
          { "internalType": "uint256", "name": "amount1Desired", "type": "uint256" },
          { "internalType": "uint256", "name": "amount0Min", "type": "uint256" },
          { "internalType": "uint256", "name": "amount1Min", "type": "uint256" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "internalType": "struct INonfungiblePositionManager.MintParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "mint",
    "outputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint128", "name": "liquidity", "type": "uint128" },
      { "internalType": "uint256", "name": "amount0", "type": "uint256" },
      { "internalType": "uint256", "name": "amount1", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Contract addresses
export const CONTRACTS = {
  WPHRS: "0x76aaaDA469D23216bE5f7C596fA25F282Ff9b364",
  USDC: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED",
  USDT: "0xD4071393f8716661958F766DF660033b3d35fD29",
  SWAP_ROUTER: "0x1A4DE519154Ae51200b0Ad7c90F7faC75547888a",
  POSITION_MANAGER: "0xF8a1D4FF0f9b9Af7CE58E1fc1833688F3BFd6115"
};

export const FIXED_AMOUNTS = {
  PHRS: 0.0005,
  USDC: 0.01,
  USDT: 0.01,
  WPHRS: 0.0005
};

const RPC_URL = "https://testnet.dplabs-internal.com";

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
    if (tokenAddress === "PHRS") {
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

// Approve token with timeout and better error handling
export async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: number,
  signer: ethers.Wallet
): Promise<ethers.TransactionResponse | null> {
  try {
    console.log(`Approving token ${tokenAddress} for ${spenderAddress}`);
    
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    
    // Add timeout wrapper for contract calls
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
    
    console.log(`Checking current allowance...`);
    // Check current allowance
    const currentAllowance = await timeoutPromise(
      contract.allowance(signer.address, spenderAddress), 
      30000
    );
    
    console.log(`Current allowance: ${currentAllowance.toString()}, Required: ${amountWei.toString()}`);
    
    if (currentAllowance < amountWei) {
      console.log(`Need approval, sending approve transaction...`);
      // Approve max amount to avoid future approvals
      const maxAmount = ethers.MaxUint256;
      
      // Add gas estimation and nonce management
      const gasEstimate = await timeoutPromise(
        contract.approve.estimateGas(spenderAddress, maxAmount),
        30000
      );
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
      
      const provider = signer.provider;
      if (!provider) throw new Error('Provider not available');
      const nonce = await provider.getTransactionCount(signer.address, 'pending');
      
      console.log(`Sending approve transaction with nonce ${nonce}...`);
      const tx = await contract.approve(spenderAddress, maxAmount, { gasLimit, nonce });
      
      console.log(`Approve transaction sent: ${tx.hash}, waiting for confirmation...`);
      const receipt = await timeoutPromise(tx.wait(), 300000); // 5 minute timeout
      console.log(`Approve transaction confirmed in block ${(receipt as any)?.blockNumber}`);
      
      return tx;
    } else {
      console.log(`Token already approved`);
    }
    
    return null; // Already approved
  } catch (error) {
    console.error('Token approval failed:', error);
    throw error;
  }
}

// Perform PHRS transfer with timeout and better error handling
export async function performTransfer(
  recipientAddress: string,
  amount: number,
  signer: ethers.Wallet
): Promise<{ hash: string; blockNumber: number | null }> {
  try {
    console.log(`Starting PHRS transfer to ${recipientAddress} amount: ${amount}`);
    
    const amountWei = ethers.parseEther(amount.toString());
    
    // Timeout wrapper
    const timeoutPromise = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };
    
    // Get current nonce to avoid replay attacks
    const provider = signer.provider;
    if (!provider) throw new Error('Provider not available');
    
    console.log(`Getting nonce for ${signer.address}...`);
    const nonce = await timeoutPromise(
      provider.getTransactionCount(signer.address, 'pending'), 
      30000
    );
    console.log(`Current nonce: ${nonce}`);
    
    // Get current gas price
    console.log(`Getting gas price...`);
    const feeData = await timeoutPromise(provider.getFeeData(), 30000);
    console.log(`Fee data:`, feeData);
    
    const txParams = {
      to: recipientAddress,
      value: amountWei,
      gasLimit: 21000,
      nonce: nonce,
      maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('2', 'gwei'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('1', 'gwei')
    };
    
    console.log(`Sending transaction with params:`, txParams);
    const tx = await timeoutPromise(signer.sendTransaction(txParams), 60000);
    console.log(`Transaction sent: ${tx.hash}, waiting for confirmation...`);
    console.log(`Explorer link: https://testnet.pharosscan.xyz/tx/${tx.hash}`);
    
    // Fast confirmation with reasonable timeout
    try {
      const receipt = await timeoutPromise(tx.wait(), 120000); // 2 minute timeout
      console.log(`✅ Transaction confirmed in block ${receipt?.blockNumber}`);
      
      return {
        hash: tx.hash,
        blockNumber: receipt?.blockNumber || null
      };
    } catch {
      console.log(`⏰ Transaction confirmation timed out after 2 minutes`);
      console.log(`📋 Transaction hash: ${tx.hash}`);
      console.log(`🔍 Check manually: https://testnet.pharosscan.xyz/tx/${tx.hash}`);
      
      // Return hash - transaction was sent successfully
      return {
        hash: tx.hash,
        blockNumber: null
      };
    }
      } catch (error: unknown) {
    console.error('Advanced transfer failed, trying simple method:', error);
    
    // Fallback to simple transfer method
    try {
      console.log('Attempting simple transfer...');
      const simpleParams = {
        to: recipientAddress,
        value: ethers.parseEther(amount.toString()),
        gasLimit: 21000
      };
      
      const simpleTx = await signer.sendTransaction(simpleParams);
      console.log(`Simple transaction sent: ${simpleTx.hash}`);
      
      // Simple confirmation with timeout like Python version
      try {
        const simpleReceipt = await simpleTx.wait();
        console.log(`Simple transaction confirmed in block ${simpleReceipt?.blockNumber}`);
        
        return {
          hash: simpleTx.hash,
          blockNumber: simpleReceipt?.blockNumber || null
        };
      } catch {
        console.log('Simple transaction sent but confirmation timed out');
        return {
          hash: simpleTx.hash,
          blockNumber: null
        };
      }
    } catch (fallbackError) {
      console.error('Both transfer methods failed:', fallbackError);
      throw fallbackError;
    }
  }
}

// Perform token swap
export async function performSwap(
  fromToken: string,
  toToken: string,
  amount: number,
  signer: ethers.Wallet
): Promise<{ hash: string; blockNumber: number | null }> {
  try {
    // First approve the token
    await approveToken(fromToken, CONTRACTS.SWAP_ROUTER, amount, signer);
    
    // Small delay after approval to prevent nonce conflicts
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contract = new ethers.Contract(fromToken, ERC20_ABI, signer);
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), decimals);
    
    // Encode swap data (simplified - you may need to adjust based on actual router interface)
    const swapData = ethers.concat([
      "0x04e45aaf", // exactInputSingle function selector
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint24", "address", "uint256", "uint256", "uint256"],
        [fromToken, toToken, 500, signer.address, amountWei, 0, 0]
      )
    ]);
    
    const swapRouter = new ethers.Contract(CONTRACTS.SWAP_ROUTER, SWAP_ROUTER_ABI, signer);
    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
    
    // Add nonce management
    const provider = signer.provider;
    if (!provider) throw new Error('Provider not available');
    const nonce = await provider.getTransactionCount(signer.address, 'pending');
    
    const tx = await swapRouter.multicall(deadline, [swapData], { nonce });
    const receipt = await tx.wait();
    
    return {
      hash: tx.hash,
      blockNumber: receipt?.blockNumber || null
    };
  } catch (error) {
    console.error('Swap failed:', error);
    throw error;
  }
}

// Add liquidity
export async function addLiquidity(
  token0: string,
  token1: string,
  amount0: number,
  amount1: number,
  signer: ethers.Wallet
): Promise<{ hash: string; blockNumber: number | null }> {
  try {
    // Ensure correct token order (token0 should be lower address)
    let sortedToken0 = token0;
    let sortedToken1 = token1;
    let sortedAmount0 = amount0;
    let sortedAmount1 = amount1;
    
    if (token0.toLowerCase() > token1.toLowerCase()) {
      sortedToken0 = token1;
      sortedToken1 = token0;
      sortedAmount0 = amount1;
      sortedAmount1 = amount0;
    }
    
    // Approve both tokens with delay to prevent nonce conflicts
    console.log(`Approving first token: ${sortedToken0}`);
    await approveToken(sortedToken0, CONTRACTS.POSITION_MANAGER, sortedAmount0, signer);
    
    // Small delay between approvals
    console.log(`Waiting before second approval...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Approving second token: ${sortedToken1}`);
    await approveToken(sortedToken1, CONTRACTS.POSITION_MANAGER, sortedAmount1, signer);
    
    // Get token decimals
    const contract0 = new ethers.Contract(sortedToken0, ERC20_ABI, signer);
    const contract1 = new ethers.Contract(sortedToken1, ERC20_ABI, signer);
    
    const [decimals0, decimals1] = await Promise.all([
      contract0.decimals(),
      contract1.decimals()
    ]);
    
    const amount0Wei = ethers.parseUnits(sortedAmount0.toString(), decimals0);
    const amount1Wei = ethers.parseUnits(sortedAmount1.toString(), decimals1);
    
    const mintParams = {
      token0: sortedToken0,
      token1: sortedToken1,
      fee: 500,
      tickLower: -887270,
      tickUpper: 887270,
      amount0Desired: amount0Wei,
      amount1Desired: amount1Wei,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
      deadline: Math.floor(Date.now() / 1000) + 600
    };
    
    const positionManager = new ethers.Contract(
      CONTRACTS.POSITION_MANAGER, 
      POSITION_MANAGER_ABI, 
      signer
    );
    
    // Add gas estimation and nonce management for better transaction success
    const gasEstimate = await positionManager.mint.estimateGas(mintParams);
    const gasLimit = Math.floor(Number(gasEstimate) * 1.2); // Add 20% buffer
    
    const provider = signer.provider;
    if (!provider) throw new Error('Provider not available');
    const nonce = await provider.getTransactionCount(signer.address, 'pending');
    
    const tx = await positionManager.mint(mintParams, { gasLimit, nonce });
    const receipt = await tx.wait();
    
    return {
      hash: tx.hash,
      blockNumber: receipt?.blockNumber || null
    };
  } catch (error) {
    console.error('Add liquidity failed:', error);
    throw error;
  }
}

// Generate swap pairs
export function getSwapPairs(): Array<{
  fromToken: string;
  toToken: string;
  amount: number;
  fromTicker: string;
  toTicker: string;
}> {
  return [
    {
      fromToken: CONTRACTS.WPHRS,
      toToken: CONTRACTS.USDC,
      amount: FIXED_AMOUNTS.WPHRS,
      fromTicker: "WPHRS",
      toTicker: "USDC"
    },
    {
      fromToken: CONTRACTS.WPHRS,
      toToken: CONTRACTS.USDT,
      amount: FIXED_AMOUNTS.WPHRS,
      fromTicker: "WPHRS",
      toTicker: "USDT"
    },
    {
      fromToken: CONTRACTS.USDC,
      toToken: CONTRACTS.WPHRS,
      amount: FIXED_AMOUNTS.USDC,
      fromTicker: "USDC",
      toTicker: "WPHRS"
    },
    {
      fromToken: CONTRACTS.USDT,
      toToken: CONTRACTS.WPHRS,
      amount: FIXED_AMOUNTS.USDT,
      fromTicker: "USDT",
      toTicker: "WPHRS"
    },
    {
      fromToken: CONTRACTS.USDC,
      toToken: CONTRACTS.USDT,
      amount: FIXED_AMOUNTS.USDC,
      fromTicker: "USDC",
      toTicker: "USDT"
    },
    {
      fromToken: CONTRACTS.USDT,
      toToken: CONTRACTS.USDC,
      amount: FIXED_AMOUNTS.USDT,
      fromTicker: "USDT",
      toTicker: "USDC"
    }
  ];
}

// Generate liquidity pairs
export function getLiquidityPairs(): Array<{
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
  ticker0: string;
  ticker1: string;
}> {
  return [
    {
      token0: CONTRACTS.USDC,
      token1: CONTRACTS.WPHRS,
      amount0: FIXED_AMOUNTS.USDC,
      amount1: FIXED_AMOUNTS.WPHRS,
      ticker0: "USDC",
      ticker1: "WPHRS"
    },
    {
      token0: CONTRACTS.USDC,
      token1: CONTRACTS.USDT,
      amount0: FIXED_AMOUNTS.USDC,
      amount1: FIXED_AMOUNTS.USDT,
      ticker0: "USDC",
      ticker1: "USDT"
    },
    {
      token0: CONTRACTS.WPHRS,
      token1: CONTRACTS.USDT,
      amount0: FIXED_AMOUNTS.WPHRS,
      amount1: FIXED_AMOUNTS.USDT,
      ticker0: "WPHRS",
      ticker1: "USDT"
    }
  ];
} 