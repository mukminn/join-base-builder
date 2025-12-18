// Simple and reliable wallet connection
// Configuration
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

// Contract ABIs (minimal)
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

// DOM Elements
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const walletStatus = document.getElementById('walletStatus');
const walletAddr = document.getElementById('walletAddr');
const walletBal = document.getElementById('walletBal');
const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const mintBtn = document.getElementById('mintBtn');
const transactionsList = document.getElementById('transactionsList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkExistingConnection();
});

function setupEventListeners() {
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
    
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
    
    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                handleWalletConnected(accounts[0]);
            }
        });
        
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }
}

async function checkExistingConnection() {
    if (!window.ethereum) return;
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
            await handleWalletConnected(accounts[0]);
        }
    } catch (error) {
        console.error('Check connection error:', error);
    }
}

async function connectWallet() {
    if (!window.ethereum) {
        alert('No wallet found! Please install MetaMask or another Web3 wallet.');
        window.open('https://metamask.io/download/', '_blank');
        return;
    }
    
    if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.querySelector('.btn-text').textContent = 'Connecting...';
    }
    
    try {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned');
        }
        
        await handleWalletConnected(accounts[0]);
        
    } catch (error) {
        console.error('Connect error:', error);
        
        if (error.code === 4001) {
            alert('Connection rejected. Please approve the connection request.');
        } else {
            alert('Failed to connect wallet: ' + (error.message || 'Unknown error'));
        }
        
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.querySelector('.btn-text').textContent = 'Connect Wallet';
        }
    }
}

async function handleWalletConnected(address) {
    try {
        userAddress = address;
        
        // Initialize provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        // Check network
        await checkNetwork();
        
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

async function checkNetwork() {
    if (!provider) return;
    
    try {
        const network = await provider.getNetwork();
        const baseChainId = 8453;
        
        if (network.chainId !== baseChainId && network.chainId !== 84532) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${baseChainId.toString(16)}` }],
                });
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
    } catch (error) {
        console.error('Network check error:', error);
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
