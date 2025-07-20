(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/automation/blockchain.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "CONTRACTS": ()=>CONTRACTS,
    "FIXED_AMOUNTS": ()=>FIXED_AMOUNTS,
    "addLiquidity": ()=>addLiquidity,
    "approveToken": ()=>approveToken,
    "generateRandomAddress": ()=>generateRandomAddress,
    "getLiquidityPairs": ()=>getLiquidityPairs,
    "getProviderAndSigner": ()=>getProviderAndSigner,
    "getSwapPairs": ()=>getSwapPairs,
    "getTokenBalance": ()=>getTokenBalance,
    "performSwap": ()=>performSwap,
    "performTransfer": ()=>performTransfer
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_context__.i("[project]/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
;
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
                    {
                        "internalType": "address",
                        "name": "token0",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "token1",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "int24",
                        "name": "tickLower",
                        "type": "int24"
                    },
                    {
                        "internalType": "int24",
                        "name": "tickUpper",
                        "type": "int24"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount0Desired",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount1Desired",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount0Min",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount1Min",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct INonfungiblePositionManager.MintParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "mint",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint128",
                "name": "liquidity",
                "type": "uint128"
            },
            {
                "internalType": "uint256",
                "name": "amount0",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount1",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    }
];
const CONTRACTS = {
    WPHRS: "0x76aaaDA469D23216bE5f7C596fA25F282Ff9b364",
    USDC: "0x72df0bcd7276f2dFbAc900D1CE63c272C4BCcCED",
    USDT: "0xD4071393f8716661958F766DF660033b3d35fD29",
    SWAP_ROUTER: "0x1A4DE519154Ae51200b0Ad7c90F7faC75547888a",
    POSITION_MANAGER: "0xF8a1D4FF0f9b9Af7CE58E1fc1833688F3BFd6115"
};
const FIXED_AMOUNTS = {
    PHRS: 0.0005,
    USDC: 0.01,
    USDT: 0.01,
    WPHRS: 0.0005
};
const RPC_URL = "https://testnet.dplabs-internal.com";
function generateRandomAddress() {
    const randomWallet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Wallet.createRandom();
    return randomWallet.address;
}
function getProviderAndSigner(privateKey) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].JsonRpcProvider(RPC_URL);
    const signer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Wallet(privateKey, provider);
    return {
        provider,
        signer
    };
}
async function getTokenBalance(tokenAddress, walletAddress, provider) {
    try {
        if (tokenAddress === "PHRS") {
            const balance = await provider.getBalance(walletAddress);
            return parseFloat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].formatEther(balance));
        }
        const contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(tokenAddress, ERC20_ABI, provider);
        const [balance, decimals] = await Promise.all([
            contract.balanceOf(walletAddress),
            contract.decimals()
        ]);
        return parseFloat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].formatUnits(balance, decimals));
    } catch (error) {
        console.error('Balance check failed:', error);
        return 0;
    }
}
async function approveToken(tokenAddress, spenderAddress, amount, signer) {
    try {
        console.log("Approving token ".concat(tokenAddress, " for ").concat(spenderAddress));
        const contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(tokenAddress, ERC20_ABI, signer);
        // Add timeout wrapper for contract calls
        const timeoutPromise = (promise, timeoutMs)=>{
            return Promise.race([
                promise,
                new Promise((_, reject)=>setTimeout(()=>reject(new Error("Operation timed out after ".concat(timeoutMs, "ms"))), timeoutMs))
            ]);
        };
        const decimals = await timeoutPromise(contract.decimals(), 30000);
        const amountWei = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseUnits(amount.toString(), decimals);
        console.log("Checking current allowance...");
        // Check current allowance
        const currentAllowance = await timeoutPromise(contract.allowance(signer.address, spenderAddress), 30000);
        console.log("Current allowance: ".concat(currentAllowance.toString(), ", Required: ").concat(amountWei.toString()));
        if (currentAllowance < amountWei) {
            console.log("Need approval, sending approve transaction...");
            // Approve max amount to avoid future approvals
            const maxAmount = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].MaxUint256;
            // Add gas estimation and nonce management
            const gasEstimate = await timeoutPromise(contract.approve.estimateGas(spenderAddress, maxAmount), 30000);
            const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
            const provider = signer.provider;
            if (!provider) throw new Error('Provider not available');
            const nonce = await provider.getTransactionCount(signer.address, 'pending');
            console.log("Sending approve transaction with nonce ".concat(nonce, "..."));
            const tx = await contract.approve(spenderAddress, maxAmount, {
                gasLimit,
                nonce
            });
            console.log("Approve transaction sent: ".concat(tx.hash, ", waiting for confirmation..."));
            const receipt = await timeoutPromise(tx.wait(), 300000); // 5 minute timeout
            console.log("Approve transaction confirmed in block ".concat(receipt === null || receipt === void 0 ? void 0 : receipt.blockNumber));
            return tx;
        } else {
            console.log("Token already approved");
        }
        return null; // Already approved
    } catch (error) {
        console.error('Token approval failed:', error);
        throw error;
    }
}
async function performTransfer(recipientAddress, amount, signer) {
    try {
        console.log("Starting PHRS transfer to ".concat(recipientAddress, " amount: ").concat(amount));
        const amountWei = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseEther(amount.toString());
        // Timeout wrapper
        const timeoutPromise = (promise, timeoutMs)=>{
            return Promise.race([
                promise,
                new Promise((_, reject)=>setTimeout(()=>reject(new Error("Operation timed out after ".concat(timeoutMs, "ms"))), timeoutMs))
            ]);
        };
        // Get current nonce to avoid replay attacks
        const provider = signer.provider;
        if (!provider) throw new Error('Provider not available');
        console.log("Getting nonce for ".concat(signer.address, "..."));
        const nonce = await timeoutPromise(provider.getTransactionCount(signer.address, 'pending'), 30000);
        console.log("Current nonce: ".concat(nonce));
        // Get current gas price
        console.log("Getting gas price...");
        const feeData = await timeoutPromise(provider.getFeeData(), 30000);
        console.log("Fee data:", feeData);
        const txParams = {
            to: recipientAddress,
            value: amountWei,
            gasLimit: 21000,
            nonce: nonce,
            maxFeePerGas: feeData.maxFeePerGas || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseUnits('2', 'gwei'),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseUnits('1', 'gwei')
        };
        console.log("Sending transaction with params:", txParams);
        const tx = await timeoutPromise(signer.sendTransaction(txParams), 60000);
        console.log("Transaction sent: ".concat(tx.hash, ", waiting for confirmation..."));
        console.log("Explorer link: https://testnet.pharosscan.xyz/tx/".concat(tx.hash));
        // Fast confirmation with reasonable timeout
        try {
            const receipt = await timeoutPromise(tx.wait(), 120000); // 2 minute timeout
            console.log("✅ Transaction confirmed in block ".concat(receipt === null || receipt === void 0 ? void 0 : receipt.blockNumber));
            return {
                hash: tx.hash,
                blockNumber: (receipt === null || receipt === void 0 ? void 0 : receipt.blockNumber) || null
            };
        } catch (confirmError) {
            console.log("⏰ Transaction confirmation timed out after 2 minutes");
            console.log("📋 Transaction hash: ".concat(tx.hash));
            console.log("🔍 Check manually: https://testnet.pharosscan.xyz/tx/".concat(tx.hash));
            // Return hash - transaction was sent successfully
            return {
                hash: tx.hash,
                blockNumber: null
            };
        }
    } catch (error) {
        console.error('Advanced transfer failed, trying simple method:', error);
        // Fallback to simple transfer method
        try {
            console.log('Attempting simple transfer...');
            const simpleParams = {
                to: recipientAddress,
                value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseEther(amount.toString()),
                gasLimit: 21000
            };
            const simpleTx = await signer.sendTransaction(simpleParams);
            console.log("Simple transaction sent: ".concat(simpleTx.hash));
            // Simple confirmation with timeout like Python version
            try {
                const simpleReceipt = await simpleTx.wait();
                console.log("Simple transaction confirmed in block ".concat(simpleReceipt === null || simpleReceipt === void 0 ? void 0 : simpleReceipt.blockNumber));
                return {
                    hash: simpleTx.hash,
                    blockNumber: (simpleReceipt === null || simpleReceipt === void 0 ? void 0 : simpleReceipt.blockNumber) || null
                };
            } catch (confirmError) {
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
async function performSwap(fromToken, toToken, amount, signer) {
    try {
        // First approve the token
        await approveToken(fromToken, CONTRACTS.SWAP_ROUTER, amount, signer);
        // Small delay after approval to prevent nonce conflicts
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        const contract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(fromToken, ERC20_ABI, signer);
        const decimals = await contract.decimals();
        const amountWei = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseUnits(amount.toString(), decimals);
        // Encode swap data (simplified - you may need to adjust based on actual router interface)
        const swapData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].concat([
            "0x04e45aaf",
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].AbiCoder.defaultAbiCoder().encode([
                "address",
                "address",
                "uint24",
                "address",
                "uint256",
                "uint256",
                "uint256"
            ], [
                fromToken,
                toToken,
                500,
                signer.address,
                amountWei,
                0,
                0
            ])
        ]);
        const swapRouter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(CONTRACTS.SWAP_ROUTER, SWAP_ROUTER_ABI, signer);
        const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
        // Add nonce management
        const provider = signer.provider;
        if (!provider) throw new Error('Provider not available');
        const nonce = await provider.getTransactionCount(signer.address, 'pending');
        const tx = await swapRouter.multicall(deadline, [
            swapData
        ], {
            nonce
        });
        const receipt = await tx.wait();
        return {
            hash: tx.hash,
            blockNumber: (receipt === null || receipt === void 0 ? void 0 : receipt.blockNumber) || null
        };
    } catch (error) {
        console.error('Swap failed:', error);
        throw error;
    }
}
async function addLiquidity(token0, token1, amount0, amount1, signer) {
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
        console.log("Approving first token: ".concat(sortedToken0));
        await approveToken(sortedToken0, CONTRACTS.POSITION_MANAGER, sortedAmount0, signer);
        // Small delay between approvals
        console.log("Waiting before second approval...");
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        console.log("Approving second token: ".concat(sortedToken1));
        await approveToken(sortedToken1, CONTRACTS.POSITION_MANAGER, sortedAmount1, signer);
        // Get token decimals
        const contract0 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(sortedToken0, ERC20_ABI, signer);
        const contract1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(sortedToken1, ERC20_ABI, signer);
        const [decimals0, decimals1] = await Promise.all([
            contract0.decimals(),
            contract1.decimals()
        ]);
        const amount0Wei = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseUnits(sortedAmount0.toString(), decimals0);
        const amount1Wei = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].parseUnits(sortedAmount1.toString(), decimals1);
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
        const positionManager = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Contract(CONTRACTS.POSITION_MANAGER, POSITION_MANAGER_ABI, signer);
        // Add gas estimation and nonce management for better transaction success
        const gasEstimate = await positionManager.mint.estimateGas(mintParams);
        const gasLimit = Math.floor(Number(gasEstimate) * 1.2); // Add 20% buffer
        const provider = signer.provider;
        if (!provider) throw new Error('Provider not available');
        const nonce = await provider.getTransactionCount(signer.address, 'pending');
        const tx = await positionManager.mint(mintParams, {
            gasLimit,
            nonce
        });
        const receipt = await tx.wait();
        return {
            hash: tx.hash,
            blockNumber: (receipt === null || receipt === void 0 ? void 0 : receipt.blockNumber) || null
        };
    } catch (error) {
        console.error('Add liquidity failed:', error);
        throw error;
    }
}
function getSwapPairs() {
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
function getLiquidityPairs() {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/automation/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>AutomationPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_context__.i("[project]/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/automation/blockchain.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const RPC_URL = "https://testnet.dplabs-internal.com";
const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function allowance(address,address) view returns (uint256)",
    "function approve(address,uint256) returns (bool)"
];
function AutomationPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCheckingAuth, setIsCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Step management
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [wallet, setWallet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [transactionCounts, setTransactionCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        transfers: 0,
        liquidity: 0,
        swaps: 0
    });
    const [proxySettings, setProxySettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: 'none',
        rotate: false
    });
    const [balances, setBalances] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [costs, setCosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Form states
    const [privateKeyInput, setPrivateKeyInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [transferCount, setTransferCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [liquidityCount, setLiquidityCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [swapCount, setSwapCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showPrivacy, setShowPrivacy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHowItWorks, setShowHowItWorks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Session ID for concurrent users
    const [sessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "AutomationPage.useState": ()=>Math.random().toString(36).substring(7)
    }["AutomationPage.useState"]);
    // Add log entry
    const addLog = (message)=>{
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev)=>{
            const newLogs = [
                ...prev,
                "[".concat(timestamp, "] ").concat(message)
            ];
            // Auto-scroll to bottom
            setTimeout(()=>{
                const logsContainer = document.querySelector('.logs');
                if (logsContainer) {
                    logsContainer.scrollTop = logsContainer.scrollHeight;
                }
            }, 100);
            return newLogs;
        });
    };
    // Render log entry with clickable links
    const renderLogEntry = (log, index)=>{
        // Check if log contains explorer URL
        const explorerMatch = log.match(/(https:\/\/testnet\.pharosscan\.xyz\/tx\/0x[a-fA-F0-9]+)/);
        if (explorerMatch) {
            const url = explorerMatch[1];
            const beforeUrl = log.substring(0, log.indexOf(url));
            const afterUrl = log.substring(log.indexOf(url) + url.length);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "log-entry",
                children: [
                    beforeUrl,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "log-link",
                        children: url
                    }, void 0, false, {
                        fileName: "[project]/src/app/automation/page.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    afterUrl
                ]
            }, index, true, {
                fileName: "[project]/src/app/automation/page.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "log-entry",
            children: log
        }, index, false, {
            fileName: "[project]/src/app/automation/page.tsx",
            lineNumber: 140,
            columnNumber: 7
        }, this);
    };
    // Generate wallet from private key
    const generateWallet = (privateKey)=>{
        try {
            const wallet = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].Wallet(privateKey);
            return {
                address: wallet.address,
                privateKey: privateKey
            };
        } catch (error) {
            return null;
        }
    };
    // Get token balance helper
    const getTokenBalanceHelper = async (tokenAddress, walletAddress)=>{
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].JsonRpcProvider(RPC_URL);
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTokenBalance"])(tokenAddress, walletAddress, provider);
    };
    // Calculate costs
    const calculateCosts = (counts)=>{
        // Transfer costs
        const phrsFromTransfers = counts.transfers * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].PHRS;
        // Liquidity costs (assume even distribution across 3 pairs)
        const lpPerPair = Math.floor(counts.liquidity / 3);
        const lpRemainder = counts.liquidity % 3;
        const usdcFromLp = (lpPerPair * 2 + Math.min(lpRemainder, 2)) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].USDC;
        const usdtFromLp = (lpPerPair * 2 + Math.max(0, Math.min(lpRemainder - 1, 2))) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].USDT;
        const wphrsFromLp = (lpPerPair * 2 + Math.max(0, lpRemainder - 2) + Math.min(lpRemainder, 1)) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].WPHRS;
        // Swap costs (assume even distribution across 6 swap types)
        const swapPerType = Math.floor(counts.swaps / 6);
        const swapRemainder = counts.swaps % 6;
        let usdcFromSwap = swapPerType * 2 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].USDC;
        let usdtFromSwap = swapPerType * 2 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].USDT;
        let wphrsFromSwap = swapPerType * 2 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].WPHRS;
        // Add remainder swaps
        if (swapRemainder > 0) {
            usdcFromSwap += Math.min(swapRemainder, 2) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].USDC;
        }
        if (swapRemainder > 2) {
            usdtFromSwap += Math.min(swapRemainder - 2, 2) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].USDT;
        }
        if (swapRemainder > 4) {
            wphrsFromSwap += (swapRemainder - 4) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].WPHRS;
        }
        // Gas buffer
        const gasBuffer = (counts.transfers + counts.liquidity + counts.swaps) * 0.001;
        return {
            phrs: phrsFromTransfers + gasBuffer,
            wphrs: wphrsFromLp + wphrsFromSwap,
            usdc: usdcFromLp + usdcFromSwap,
            usdt: usdtFromLp + usdtFromSwap
        };
    };
    // Check balances
    const checkBalances = async (walletAddress)=>{
        try {
            const [phrsBalance, wphrsBalance, usdcBalance, usdtBalance] = await Promise.all([
                getTokenBalanceHelper("PHRS", walletAddress),
                getTokenBalanceHelper(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONTRACTS"].WPHRS, walletAddress),
                getTokenBalanceHelper(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONTRACTS"].USDC, walletAddress),
                getTokenBalanceHelper(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONTRACTS"].USDT, walletAddress)
            ]);
            return {
                phrs: phrsBalance,
                wphrs: wphrsBalance,
                usdc: usdcBalance,
                usdt: usdtBalance
            };
        } catch (error) {
            console.error('Balance check failed:', error);
            return null;
        }
    };
    // Step handlers
    const handlePrivateKeySubmit = ()=>{
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
    const handleTransferCountSubmit = ()=>{
        const count = parseInt(transferCount);
        if (isNaN(count) || count < 0) {
            setError('Please enter a valid number (0 or positive)');
            return;
        }
        setTransactionCounts((prev)=>({
                ...prev,
                transfers: count
            }));
        setError('');
        setCurrentStep(2);
    };
    const handleLiquidityCountSubmit = ()=>{
        const count = parseInt(liquidityCount);
        if (isNaN(count) || count < 0) {
            setError('Please enter a valid number (0 or positive)');
            return;
        }
        setTransactionCounts((prev)=>({
                ...prev,
                liquidity: count
            }));
        setError('');
        setCurrentStep(3);
    };
    const handleSwapCountSubmit = ()=>{
        const count = parseInt(swapCount);
        if (isNaN(count) || count < 0) {
            setError('Please enter a valid number (0 or positive)');
            return;
        }
        setTransactionCounts((prev)=>({
                ...prev,
                swaps: count
            }));
        setError('');
        setCurrentStep(4);
    };
    const handleProxySelection = (type)=>{
        if (type === 'none') {
            setProxySettings({
                type,
                rotate: false
            });
            setCurrentStep(5);
        } else {
            setProxySettings((prev)=>({
                    ...prev,
                    type
                }));
            setCurrentStep(4.5); // Intermediate step for rotation question
        }
    };
    const handleRotateSelection = (rotate)=>{
        setProxySettings((prev)=>({
                ...prev,
                rotate
            }));
        setCurrentStep(5);
    };
    const handleCostCalculation = async ()=>{
        if (!wallet) return;
        const calculatedCosts = calculateCosts(transactionCounts);
        setCosts(calculatedCosts);
        const walletBalances = await checkBalances(wallet.address);
        setBalances(walletBalances);
        setCurrentStep(6);
    };
    const checkSufficientBalance = ()=>{
        if (!balances || !costs) return false;
        return balances.phrs >= costs.phrs && balances.wphrs >= costs.wphrs && balances.usdc >= costs.usdc && balances.usdt >= costs.usdt;
    };
    const startAutomation = async ()=>{
        if (!wallet) return;
        setIsProcessing(true);
        setCurrentStep(7);
        addLog("🚀 Starting automation process...");
        addLog("📧 Session ID: ".concat(sessionId));
        addLog("👛 Wallet: ".concat(wallet.address));
        // Add timeout for entire automation process
        const automationTimeout = setTimeout(()=>{
            addLog("⏰ Automation timed out after 30 minutes");
            setIsProcessing(false);
        }, 30 * 60 * 1000); // 30 minutes
        try {
            const { provider, signer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProviderAndSigner"])(wallet.privateKey);
            // Test network connectivity first
            addLog("🔍 Testing network connectivity...");
            try {
                const blockNumber = await provider.getBlockNumber();
                addLog("✅ Connected to network (block ".concat(blockNumber, ")"));
                const balance = await provider.getBalance(wallet.address);
                const balanceEth = parseFloat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].formatEther(balance));
                addLog("💰 Current balance: ".concat(balanceEth.toFixed(6), " PHRS"));
                if (balanceEth < 0.001) {
                    addLog("⚠️ Warning: Very low balance, transactions may fail");
                }
            } catch (networkError) {
                addLog("❌ Network connectivity failed: ".concat(networkError));
                throw new Error("Network connectivity issue");
            }
            // Execute transfers
            if (transactionCounts.transfers > 0) {
                addLog("=== FRIEND TRANSFERS ===");
                for(let i = 0; i < transactionCounts.transfers; i++){
                    addLog("Transfer ".concat(i + 1, "/").concat(transactionCounts.transfers));
                    const receiver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateRandomAddress"])();
                    addLog("     To: ".concat(receiver.slice(0, 6), "...").concat(receiver.slice(-6)));
                    addLog("     Amount: ".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].PHRS, " PHRS"));
                    addLog("     🔄 Preparing transaction...");
                    try {
                        // Add progress indicator for long operations
                        const progressInterval = setInterval(()=>{
                            addLog("     ⏳ Transaction in progress...");
                        }, 30000); // Update every 30 seconds
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performTransfer"])(receiver, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIXED_AMOUNTS"].PHRS, signer);
                        clearInterval(progressInterval);
                        addLog("     🔗 Explorer: https://testnet.pharosscan.xyz/tx/".concat(result.hash));
                        if (result.blockNumber) {
                            addLog("     ✅ Transfer confirmed in block ".concat(result.blockNumber));
                        } else {
                            addLog("     ✅ Transfer sent (confirmation pending)");
                        }
                        addLog("     📋 Hash: ".concat(result.hash));
                    } catch (error) {
                        addLog("     ❌ Transfer failed: ".concat(error.message || error));
                        console.error('Transfer error:', error);
                        // Continue with next transfer even if one fails
                        addLog("     ⏭️ Continuing to next transfer...");
                    }
                    // Wait between transactions to prevent nonce conflicts
                    if (i < transactionCounts.transfers - 1) {
                        addLog("     ⏳ Waiting 5 seconds before next transfer...");
                        await new Promise((resolve)=>setTimeout(resolve, 5000));
                    }
                }
            }
            // Execute liquidity additions
            if (transactionCounts.liquidity > 0) {
                addLog("=== ADD LIQUIDITY ===");
                const liquidityPairs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLiquidityPairs"])();
                for(let i = 0; i < transactionCounts.liquidity; i++){
                    addLog("Liquidity ".concat(i + 1, "/").concat(transactionCounts.liquidity));
                    const pair = liquidityPairs[i % liquidityPairs.length];
                    addLog("     Pair: ".concat(pair.ticker0, "/").concat(pair.ticker1));
                    addLog("     Amount: ".concat(pair.amount0, " ").concat(pair.ticker0, " + ").concat(pair.amount1, " ").concat(pair.ticker1));
                    try {
                        addLog("     🔄 Starting liquidity addition...");
                        addLog("     📝 Approving ".concat(pair.ticker0, " token..."));
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addLiquidity"])(pair.token0, pair.token1, pair.amount0, pair.amount1, signer);
                        addLog("     ✅ Liquidity added successfully");
                        addLog("     Hash: ".concat(result.hash));
                        addLog("     Block: ".concat(result.blockNumber));
                        addLog("     Explorer: https://testnet.pharosscan.xyz/tx/".concat(result.hash));
                    } catch (error) {
                        addLog("     ❌ Add liquidity failed: ".concat(error.message || error));
                        console.error('Detailed error:', error);
                    }
                    await new Promise((resolve)=>setTimeout(resolve, 5000));
                }
            }
            // Execute swaps
            if (transactionCounts.swaps > 0) {
                addLog("=== SWAPS ===");
                const swapPairs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSwapPairs"])();
                for(let i = 0; i < transactionCounts.swaps; i++){
                    addLog("Swap ".concat(i + 1, "/").concat(transactionCounts.swaps));
                    const pair = swapPairs[i % swapPairs.length];
                    addLog("     Swap: ".concat(pair.fromTicker, " → ").concat(pair.toTicker));
                    addLog("     Amount: ".concat(pair.amount, " ").concat(pair.fromTicker));
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$automation$2f$blockchain$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["performSwap"])(pair.fromToken, pair.toToken, pair.amount, signer);
                        addLog("     ✅ Swap successful");
                        addLog("     Hash: ".concat(result.hash));
                        addLog("     Block: ".concat(result.blockNumber));
                        addLog("     Explorer: https://testnet.pharosscan.xyz/tx/".concat(result.hash));
                    } catch (error) {
                        addLog("     ❌ Swap failed: ".concat(error.message || error));
                        console.error('Swap error:', error);
                    }
                    await new Promise((resolve)=>setTimeout(resolve, 5000));
                }
            }
            addLog("🎉 All operations completed successfully!");
            clearTimeout(automationTimeout);
            setIsProcessing(false);
        } catch (error) {
            addLog("❌ Automation failed: ".concat(error.message || error));
            console.error('Automation error:', error);
            clearTimeout(automationTimeout);
            setIsProcessing(false);
        }
    };
    // Auto-calculate costs when reaching step 5
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutomationPage.useEffect": ()=>{
            if (currentStep === 5) {
                handleCostCalculation();
            }
        }
    }["AutomationPage.useEffect"], [
        currentStep
    ]);
    const renderStep = ()=>{
        switch(currentStep){
            case 0:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Enter your wallet private key"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 494,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "password",
                            className: "input",
                            placeholder: "Private Key",
                            value: privateKeyInput,
                            onChange: (e)=>{
                                setPrivateKeyInput(e.target.value);
                                setError('');
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 495,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 505,
                            columnNumber: 23
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handlePrivateKeySubmit,
                            className: "button",
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 506,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 493,
                    columnNumber: 11
                }, this);
            case 1:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "How many friend transfers?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 515,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: "input",
                            placeholder: "Number of transfers",
                            value: transferCount,
                            onChange: (e)=>{
                                setTransferCount(e.target.value);
                                setError('');
                            },
                            min: "0"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 516,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 527,
                            columnNumber: 23
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleTransferCountSubmit,
                            className: "button",
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 528,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 514,
                    columnNumber: 11
                }, this);
            case 2:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "How many add liquidity transactions?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 537,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: "input",
                            placeholder: "Number of liquidity transactions",
                            value: liquidityCount,
                            onChange: (e)=>{
                                setLiquidityCount(e.target.value);
                                setError('');
                            },
                            min: "0"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 538,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 549,
                            columnNumber: 23
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLiquidityCountSubmit,
                            className: "button",
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 550,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 536,
                    columnNumber: 11
                }, this);
            case 3:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "How many swap transactions?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 559,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: "input",
                            placeholder: "Number of swap transactions",
                            value: swapCount,
                            onChange: (e)=>{
                                setSwapCount(e.target.value);
                                setError('');
                            },
                            min: "0"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 560,
                            columnNumber: 13
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 571,
                            columnNumber: 23
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSwapCountSubmit,
                            className: "button",
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 558,
                    columnNumber: 11
                }, this);
            case 4:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Proxy Settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 581,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "button-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleProxySelection('free'),
                                    className: "button secondary",
                                    children: "Use Free Proxyscrape proxy"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 583,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleProxySelection('custom'),
                                    className: "button secondary",
                                    children: "Use custom proxy"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 589,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleProxySelection('none'),
                                    className: "button secondary",
                                    children: "No proxy"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 595,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 582,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 580,
                    columnNumber: 11
                }, this);
            case 4.5:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Rotate invalid proxy?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 608,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "button-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleRotateSelection(true),
                                    className: "button secondary",
                                    children: "YES"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 610,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleRotateSelection(false),
                                    className: "button secondary",
                                    children: "NO"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 616,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 609,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 607,
                    columnNumber: 11
                }, this);
            case 6:
                const hasSufficientBalance = checkSufficientBalance();
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "step-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Cost Calculation"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 630,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cost-breakdown",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Transaction Summary:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 632,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                "Friend Transfers: ",
                                                transactionCounts.transfers
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 634,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                "Add Liquidity: ",
                                                transactionCounts.liquidity
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                "Swaps: ",
                                                transactionCounts.swaps
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 636,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 633,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Required Tokens:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 639,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "balance-comparison",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "balance-item ".concat(balances && costs && balances.phrs >= costs.phrs ? 'sufficient' : 'insufficient'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "PHRS: ",
                                                    costs === null || costs === void 0 ? void 0 : costs.phrs.toFixed(4),
                                                    " (Balance: ",
                                                    balances === null || balances === void 0 ? void 0 : balances.phrs.toFixed(4),
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/automation/page.tsx",
                                                lineNumber: 642,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 641,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "balance-item ".concat(balances && costs && balances.wphrs >= costs.wphrs ? 'sufficient' : 'insufficient'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "WPHRS: ",
                                                    costs === null || costs === void 0 ? void 0 : costs.wphrs.toFixed(4),
                                                    " (Balance: ",
                                                    balances === null || balances === void 0 ? void 0 : balances.wphrs.toFixed(4),
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/automation/page.tsx",
                                                lineNumber: 645,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 644,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "balance-item ".concat(balances && costs && balances.usdc >= costs.usdc ? 'sufficient' : 'insufficient'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "USDC: ",
                                                    costs === null || costs === void 0 ? void 0 : costs.usdc.toFixed(4),
                                                    " (Balance: ",
                                                    balances === null || balances === void 0 ? void 0 : balances.usdc.toFixed(4),
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/automation/page.tsx",
                                                lineNumber: 648,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 647,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "balance-item ".concat(balances && costs && balances.usdt >= costs.usdt ? 'sufficient' : 'insufficient'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "USDT: ",
                                                    costs === null || costs === void 0 ? void 0 : costs.usdt.toFixed(4),
                                                    " (Balance: ",
                                                    balances === null || balances === void 0 ? void 0 : balances.usdt.toFixed(4),
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/automation/page.tsx",
                                                lineNumber: 651,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 650,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 640,
                                    columnNumber: 15
                                }, this),
                                !hasSufficientBalance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "warning",
                                    children: "⚠️ Insufficient balance for one or more tokens. Please ensure you have enough tokens before proceeding."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 656,
                                    columnNumber: 17
                                }, this),
                                hasSufficientBalance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "success-container",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "success",
                                            children: "🎉 You are ready to go!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 663,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "button-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: startAutomation,
                                                    className: "button",
                                                    children: "Let's Go"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 665,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setCurrentStep(0),
                                                    className: "button secondary",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 668,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 664,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 662,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 631,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 629,
                    columnNumber: 11
                }, this);
            case 7:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "automation-container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "warning-header",
                            children: [
                                isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "loading-spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 682,
                                    columnNumber: 32
                                }, this),
                                "⚠️ Don't close the browser until it's finished"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 681,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "logs-container",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Live Logs:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 686,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "logs",
                                    children: logs.map((log, index)=>renderLogEntry(log, index))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 687,
                                    columnNumber: 15
                                }, this),
                                isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "automation-controls",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            addLog("⏹️ Automation stopped by user");
                                            setIsProcessing(false);
                                        },
                                        className: "button secondary",
                                        style: {
                                            marginTop: '15px'
                                        },
                                        children: "Stop Automation"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/automation/page.tsx",
                                        lineNumber: 692,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 691,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 685,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 680,
                    columnNumber: 11
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: "Unknown step"
                }, void 0, false, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 709,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "automation-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    children: "Pharos Network Automation"
                }, void 0, false, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 717,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/automation/page.tsx",
                lineNumber: 716,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content",
                children: renderStep()
            }, void 0, false, {
                fileName: "[project]/src/app/automation/page.tsx",
                lineNumber: 721,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "footer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "footer-links",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowPrivacy(true),
                            className: "footer-link",
                            children: "Privacy"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 728,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowHowItWorks(true),
                            className: "footer-link",
                            children: "How it works"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 734,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 727,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/automation/page.tsx",
                lineNumber: 726,
                columnNumber: 7
            }, this),
            showPrivacy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                onClick: ()=>setShowPrivacy(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "Privacy Policy"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 747,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "At Pharos Network Automation, we take your privacy and security seriously. Here's what you need to know about how we handle your information:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 749,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Your Wallet Security"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "• We never store your private keys on our servers",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 755,
                                            columnNumber: 66
                                        }, this),
                                        "• All operations are performed in your browser session only",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 756,
                                            columnNumber: 76
                                        }, this),
                                        "• Your private key is used temporarily for transaction signing and then discarded",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 757,
                                            columnNumber: 98
                                        }, this),
                                        "• We don't have any database or permanent storage system"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 754,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Session-Based Processing"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 760,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "• Each user gets a unique session ID for concurrent usage",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 762,
                                            columnNumber: 74
                                        }, this),
                                        "• Sessions are temporary and expire when you close the browser",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 763,
                                            columnNumber: 79
                                        }, this),
                                        "• No personal data is collected or transmitted to external services"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 761,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Transaction Privacy"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 766,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "• All transactions are performed directly on the blockchain",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 76
                                        }, this),
                                        "• We don't monitor or log your transaction activities",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 70
                                        }, this),
                                        "• Your wallet interactions remain completely private"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 767,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "emphasis",
                                    children: "Your security is our top priority. This tool operates entirely client-side to ensure maximum privacy and security for your assets."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 772,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 748,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowPrivacy(false),
                            className: "button",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 777,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 746,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/automation/page.tsx",
                lineNumber: 745,
                columnNumber: 9
            }, this),
            showHowItWorks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-overlay",
                onClick: ()=>setShowHowItWorks(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "How It Works"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 788,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Step-by-Step Process"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 790,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Wallet Connection:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 792,
                                                    columnNumber: 21
                                                }, this),
                                                " Enter your private key to generate wallet address"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 792,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Transaction Configuration:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 793,
                                                    columnNumber: 21
                                                }, this),
                                                " Set how many transactions you want for each type"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 793,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Proxy Settings:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 21
                                                }, this),
                                                " Choose your preferred proxy configuration"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 794,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Balance Verification:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 21
                                                }, this),
                                                " System checks if you have sufficient tokens"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 795,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Automated Execution:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 796,
                                                    columnNumber: 21
                                                }, this),
                                                " Transactions are executed automatically"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 796,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 791,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Fixed Transaction Amounts"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 799,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "To ensure consistency and prevent errors, we use fixed amounts for all transactions:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 800,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "PHRS Transfers:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 21
                                                }, this),
                                                " 0.0005 PHRS per transaction"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 802,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "USDC Operations:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 803,
                                                    columnNumber: 21
                                                }, this),
                                                " 0.01 USDC per transaction"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 803,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "USDT Operations:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 804,
                                                    columnNumber: 21
                                                }, this),
                                                " 0.01 USDT per transaction"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 804,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "WPHRS Operations:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/automation/page.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 21
                                                }, this),
                                                " 0.0005 WPHRS per transaction"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 805,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 801,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Transaction Types"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 808,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Friend Transfers:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 809,
                                            columnNumber: 18
                                        }, this),
                                        " Send PHRS to randomly generated addresses"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 809,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Add Liquidity:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 810,
                                            columnNumber: 18
                                        }, this),
                                        " Add liquidity to three pairs (USDC/WPHRS, USDC/USDT, WPHRS/USDT)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 810,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Swaps:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 811,
                                            columnNumber: 18
                                        }, this),
                                        " Perform token swaps across six different pairs"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 811,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Safety Features"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 813,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Balance verification before execution"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 815,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Session-based operation for security"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 816,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Real-time transaction monitoring"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 817,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Automatic gas estimation and optimization"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/automation/page.tsx",
                                            lineNumber: 818,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/automation/page.tsx",
                                    lineNumber: 814,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 789,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowHowItWorks(false),
                            className: "button",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/src/app/automation/page.tsx",
                            lineNumber: 821,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/automation/page.tsx",
                    lineNumber: 787,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/automation/page.tsx",
                lineNumber: 786,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/automation/page.tsx",
        lineNumber: 714,
        columnNumber: 5
    }, this);
}
_s(AutomationPage, "kRpQIRqRlnviuYIJ/Y3eO+IkXFc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AutomationPage;
var _c;
__turbopack_context__.k.register(_c, "AutomationPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_automation_d7e8dfc8._.js.map