// Reown/WalletConnect Integration
// Based on https://demo.reown.com configuration

const CONFIG = window.CONFIG || {
    contracts: {
        feeGenerator: "0x33b5b0136bD1812E644eBC089af88706C9A3815d",
        simpleNFT: "0x..."
    },
    fees: {
        minDeposit: "0.001",
        nftMintPrice: "0.001"
    }
};

// Contract ABIs
const FEE_ABI = [
    "function deposit() external payable",
    "function withdraw(uint256 amount) external",
    "function getBalance() external view returns (uint256)",
    "function getTotalFees() external view returns (uint256)",
    "event Deposit(address indexed user, uint256 amount, uint256 fee)",
    "event Withdraw(address indexed user, uint256 amount, uint256 fee)"
];

const NFT_ABI = [
    "function mintNFT(string memory tokenURI) external payable",
    "function balanceOf(address owner) external view returns (uint256)",
    "function getTotalFees() external view returns (uint256)",
    "event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 fee)"
];

// State
let provider = null;
let signer = null;
let feeContract = null;
let nftContract = null;
let userAddress = null;
let refreshTimer = null;
let reownAppKit = null;

// DOM Elements
const connectBtn = document.getElementById('reown-connect');
const disconnectBtn = document.getElementById('disconnectBtn');
const walletStatus = document.getElementById('walletStatus');
const walletAddr = document.getElementById('walletAddr');
const walletBal = document.getElementById('walletBal');
const networkName = document.getElementById('networkName');
const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const mintBtn = document.getElementById('mintBtn');
const transactionsList = document.getElementById('transactionsList');

// Initialize Reown AppKit
async function initReown() {
    try {
        // Wait for Reown to load
        if (typeof window.ReownAppKit === 'undefined') {
            await new Promise(resolve => {
                const checkReown = setInterval(() => {
                    if (typeof window.ReownAppKit !== 'undefined') {
                        clearInterval(checkReown);
                        resolve();
                    }
                }, 100);
            });
        }

        // Initialize Reown AppKit with configuration from demo
        reownAppKit = window.ReownAppKit.init({
            projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.reown.com
            metadata: {
                name: 'Base Builders December',
                description: 'DeFi Mini App for Base Ecosystem',
                url: window.location.origin,
                icons: [`${window.location.origin}/icon.png`]
            },
            features: {
                receive: true,
                send: true,
                emailShowWallets: true,
                connectorTypeOrder: ['walletConnect', 'recent', 'injected', 'featured', 'custom', 'external', 'recommended'],
                analytics: true,
                allWallets: true,
                legalCheckbox: false,
                smartSessions: false,
                collapseWallets: false,
                walletFeaturesOrder: ['onramp', 'swaps', 'receive', 'send'],
                connectMethodsOrder: ['wallet', 'email', 'social']
            },
            themeMode: 'dark',
            themeVariables: {},
            chains: [
                {
                    id: 8453, // Base Mainnet
                    name: 'Base',
                    currency: 'ETH',
                    explorerUrl: 'https://basescan.org',
                    rpcUrl: 'https://mainnet.base.org'
                },
                {
                    id: 84532, // Base Sepolia
                    name: 'Base Sepolia',
                    currency: 'ETH',
                    explorerUrl: 'https://sepolia.basescan.org',
                    rpcUrl: 'https://sepolia.base.org'
                }
            ],
            remoteFeatures: {
                swaps: ['1inch'],
                onramp: ['meld'],
                email: true,
                socials: ['google', 'x', 'farcaster', 'discord', 'apple', 'github', 'facebook'],
                activity: true,
                reownBranding: true,
                multiWallet: true,
                emailCapture: false,
                payWithExchange: true,
                payments: true,
                reownAuthentication: false
            }
        });

        // Subscribe to events
        reownAppKit.subscribeState((state) => {
            if (state.address) {
                handleWalletConnected(state.address, state.chainId);
            } else {
                disconnectWallet();
            }
        });

        // Setup connect button
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                reownAppKit.open();
            });
        }

        // Check if already connected
        const state = reownAppKit.getState();
        if (state.address) {
            handleWalletConnected(state.address, state.chainId);
        }

    } catch (error) {
        console.error('Reown init error:', error);
        // Fallback to simple wallet connection
        initFallbackWallet();
    }
}

// Fallback wallet connection (if Reown fails)
function initFallbackWallet() {
    if (!window.ethereum) {
        console.warn('No wallet provider found');
        return;
    }

    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    await handleWalletConnected(accounts[0], 8453);
                }
            } catch (error) {
                console.error('Connect error:', error);
                alert('Failed to connect wallet: ' + error.message);
            }
        });
    }

    // Check existing connection
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts && accounts.length > 0) {
            handleWalletConnected(accounts[0], 8453);
        }
    });
}

async function handleWalletConnected(address, chainId) {
    try {
        userAddress = address;

        // Initialize provider based on connection type
        if (reownAppKit && reownAppKit.getProvider) {
            provider = new ethers.providers.Web3Provider(reownAppKit.getProvider());
        } else if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
            throw new Error('No provider available');
        }

        signer = provider.getSigner();

        // Update network name
        if (networkName) {
            const network = await provider.getNetwork();
            networkName.textContent = network.name || 'Base';
        }

        // Check and switch to Base if needed
        await checkNetwork(chainId);

        // Initialize contracts
        if (CONFIG.contracts.feeGenerator && CONFIG.contracts.feeGenerator !== '0x...') {
            feeContract = new ethers.Contract(CONFIG.contracts.feeGenerator, FEE_ABI, signer);
        }

        if (CONFIG.contracts.simpleNFT && CONFIG.contracts.simpleNFT !== '0x...') {
            nftContract = new ethers.Contract(CONFIG.contracts.simpleNFT, NFT_ABI, signer);
        }

        // Update UI
        updateUI();

        // Load data
        await loadData();

        // Setup listeners
        setupContractListeners();

        // Start refresh
        startRefresh();

    } catch (error) {
        console.error('Handle connection error:', error);
        alert('Error setting up wallet: ' + error.message);
    }
}

async function checkNetwork(chainId) {
    if (!provider) return;

    const baseChainId = 8453;
    const baseSepoliaChainId = 84532;

    if (chainId !== baseChainId && chainId !== baseSepoliaChainId) {
        try {
            if (window.ethereum) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${baseChainId.toString(16)}` }],
                });
            }
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x2105',
                        chainName: 'Base',
                        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                        rpcUrls: ['https://mainnet.base.org'],
                        blockExplorerUrls: ['https://basescan.org']
                    }]
                });
            }
        }
    }
}

function updateUI() {
    if (walletAddr && userAddress) {
        walletAddr.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    }

    if (walletStatus) {
        walletStatus.classList.remove('hidden');
    }

    if (connectBtn) {
        connectBtn.classList.add('connected');
        connectBtn.disabled = true;
        connectBtn.querySelector('.btn-text').textContent = 'Connected';
    }
}

async function loadData() {
    if (!userAddress || !provider) return;

    try {
        // Wallet balance
        const balance = await provider.getBalance(userAddress);
        if (walletBal) {
            walletBal.textContent = parseFloat(ethers.utils.formatEther(balance)).toFixed(4) + ' ETH';
        }

        // Contract data
        if (feeContract) {
            try {
                const [userBalance, totalFees] = await Promise.all([
                    feeContract.getBalance(),
                    feeContract.getTotalFees()
                ]);

                const userBalanceEl = document.getElementById('userBalance');
                const totalFeesEl = document.getElementById('totalFees');

                if (userBalanceEl) {
                    userBalanceEl.textContent = parseFloat(ethers.utils.formatEther(userBalance)).toFixed(4) + ' ETH';
                }
                if (totalFeesEl) {
                    totalFeesEl.textContent = parseFloat(ethers.utils.formatEther(totalFees)).toFixed(4) + ' ETH';
                }
            } catch (error) {
                console.error('Load contract data error:', error);
            }
        }

        // NFT data
        if (nftContract && userAddress) {
            try {
                const [nftBalance, nftFees] = await Promise.all([
                    nftContract.balanceOf(userAddress),
                    nftContract.getTotalFees()
                ]);

                const userNFTsEl = document.getElementById('userNFTs');
                const nftFeesEl = document.getElementById('nftFees');

                if (userNFTsEl) {
                    userNFTsEl.textContent = nftBalance.toString();
                }
                if (nftFeesEl) {
                    nftFeesEl.textContent = parseFloat(ethers.utils.formatEther(nftFees)).toFixed(4) + ' ETH';
                }
            } catch (error) {
                console.warn('NFT data error:', error);
            }
        }
    } catch (error) {
        console.error('Load data error:', error);
    }
}

function setupContractListeners() {
    if (!feeContract) return;

    try {
        feeContract.removeAllListeners();

        feeContract.on('Deposit', (user, amount, fee) => {
            if (user && userAddress && user.toLowerCase() === userAddress.toLowerCase()) {
                addTransaction('Deposit successful', amount, fee, true);
                setTimeout(loadData, 2000);
            }
        });

        feeContract.on('Withdraw', (user, amount, fee) => {
            if (user && userAddress && user.toLowerCase() === userAddress.toLowerCase()) {
                addTransaction('Withdraw successful', amount, fee, true);
                setTimeout(loadData, 2000);
            }
        });

        if (nftContract) {
            nftContract.removeAllListeners('NFTMinted');
            nftContract.on('NFTMinted', (to, tokenId, fee) => {
                if (to && userAddress && to.toLowerCase() === userAddress.toLowerCase()) {
                    addTransaction(`NFT #${tokenId} minted`, fee, null, true);
                    setTimeout(loadData, 2000);
                }
            });
        }
    } catch (error) {
        console.error('Setup listeners error:', error);
    }
}

async function handleDeposit() {
    if (!feeContract) {
        alert('Please connect wallet first!');
        return;
    }

    const input = document.getElementById('depositInput');
    if (!input || !input.value) {
        alert('Please enter an amount');
        return;
    }

    const amount = input.value;
    const minDeposit = parseFloat(CONFIG.fees.minDeposit || "0.001");

    if (parseFloat(amount) < minDeposit) {
        alert(`Minimum deposit is ${minDeposit} ETH`);
        return;
    }

    if (depositBtn) {
        depositBtn.disabled = true;
        depositBtn.textContent = 'Processing...';
    }

    try {
        const tx = await feeContract.deposit({
            value: ethers.utils.parseEther(amount)
        });

        addTransaction('Deposit pending...', amount, null, false);
        await tx.wait();
        addTransaction('Deposit confirmed!', amount, null, true);

        input.value = '';
        await loadData();
    } catch (error) {
        console.error('Deposit error:', error);
        addTransaction('Deposit failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (depositBtn) {
            depositBtn.disabled = false;
            depositBtn.textContent = 'Deposit';
        }
    }
}

async function handleWithdraw() {
    if (!feeContract) {
        alert('Please connect wallet first!');
        return;
    }

    const input = document.getElementById('withdrawInput');
    if (!input || !input.value) {
        alert('Please enter an amount');
        return;
    }

    const amount = input.value;

    if (withdrawBtn) {
        withdrawBtn.disabled = true;
        withdrawBtn.textContent = 'Processing...';
    }

    try {
        const tx = await feeContract.withdraw(ethers.utils.parseEther(amount));
        addTransaction('Withdraw pending...', amount, null, false);
        await tx.wait();
        addTransaction('Withdraw confirmed!', amount, null, true);

        input.value = '';
        await loadData();
    } catch (error) {
        console.error('Withdraw error:', error);
        addTransaction('Withdraw failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (withdrawBtn) {
            withdrawBtn.disabled = false;
            withdrawBtn.textContent = 'Withdraw';
        }
    }
}

async function handleMint() {
    if (!nftContract) {
        alert('Please connect wallet first!');
        return;
    }

    const input = document.getElementById('nftURIInput');
    const tokenURI = input ? input.value : "https://example.com/metadata.json";
    const mintPrice = ethers.utils.parseEther(CONFIG.fees.nftMintPrice || "0.001");

    if (mintBtn) {
        mintBtn.disabled = true;
        mintBtn.textContent = 'Minting...';
    }

    try {
        const tx = await nftContract.mintNFT(tokenURI, { value: mintPrice });
        addTransaction('Minting NFT...', CONFIG.fees.nftMintPrice || "0.001", null, false);
        await tx.wait();
        addTransaction('NFT minted successfully!', CONFIG.fees.nftMintPrice || "0.001", null, true);

        if (input) input.value = '';
        await loadData();
    } catch (error) {
        console.error('Mint error:', error);
        addTransaction('Mint failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (mintBtn) {
            mintBtn.disabled = false;
            mintBtn.textContent = 'Mint NFT (0.001 ETH)';
        }
    }
}

function addTransaction(message, amount, fee, success) {
    if (!transactionsList) return;

    const item = document.createElement('div');
    item.className = `transaction-item ${success ? 'success' : 'error'}`;

    let html = `<p><strong>${message}</strong></p>`;
    if (amount) {
        html += `<p>Amount: ${amount} ETH</p>`;
    }
    if (fee) {
        html += `<p>Fee: ${parseFloat(ethers.utils.formatEther(fee)).toFixed(6)} ETH</p>`;
    }
    html += `<p style="font-size: 0.8rem; color: var(--text-secondary);">${new Date().toLocaleTimeString()}</p>`;

    item.innerHTML = html;
    transactionsList.insertBefore(item, transactionsList.firstChild);

    // Keep only last 10
    while (transactionsList.children.length > 10) {
        transactionsList.removeChild(transactionsList.lastChild);
    }
}

function disconnectWallet() {
    stopRefresh();
    
    if (reownAppKit) {
        reownAppKit.disconnect();
    }
    
    feeContract = null;
    nftContract = null;
    signer = null;
    userAddress = null;
    provider = null;

    if (walletStatus) {
        walletStatus.classList.add('hidden');
    }

    if (connectBtn) {
        connectBtn.classList.remove('connected');
        connectBtn.disabled = false;
        connectBtn.querySelector('.btn-text').textContent = 'Connect Wallet';
    }

    // Clear data
    const elements = ['walletBal', 'totalFees', 'userBalance', 'userNFTs', 'nftFees'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = id.includes('NFTs') ? '0' : '0 ETH';
    });

    if (transactionsList) {
        transactionsList.innerHTML = '';
    }
}

function startRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);

    refreshTimer = setInterval(() => {
        if (userAddress && provider) {
            loadData().catch(err => console.error('Refresh error:', err));
        }
    }, 30000);
}

function stopRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// Setup event listeners
if (disconnectBtn) {
    disconnectBtn.addEventListener('click', disconnectWallet);
}

if (depositBtn) {
    depositBtn.addEventListener('click', handleDeposit);
}

if (withdrawBtn) {
    withdrawBtn.addEventListener('click', handleWithdraw);
}

if (mintBtn) {
    mintBtn.addEventListener('click', handleMint);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReown);
} else {
    setTimeout(initReown, 100);
}
