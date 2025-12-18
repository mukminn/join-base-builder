// Load configuration - Fallback jika config.js tidak loaded
let CONFIG = window.CONFIG || {
    contracts: {
        feeGenerator: "0x33b5b0136bD1812E644eBC089af88706C9A3815d",
        simpleNFT: "0x..."
    },
    networks: {
        base: { chainId: 8453 },
        baseSepolia: { chainId: 84532 }
    },
    fees: {
        minDeposit: "0.001",
        nftMintPrice: "0.001",
        feePercentage: 2
    }
};

const FEE_GENERATOR_ADDRESS = CONFIG.contracts.feeGenerator;
const NFT_CONTRACT_ADDRESS = CONFIG.contracts.simpleNFT;

// ABI untuk FeeGenerator
const FEE_GENERATOR_ABI = [
    "function deposit() external payable",
    "function withdraw(uint256 amount) external",
    "function getBalance() external view returns (uint256)",
    "function getTotalFees() external view returns (uint256)",
    "function getStats() external view returns (uint256, uint256, uint256, uint256)",
    "event Deposit(address indexed user, uint256 amount, uint256 fee)",
    "event Withdraw(address indexed user, uint256 amount, uint256 fee)"
];

// ABI untuk SimpleNFT
const NFT_ABI = [
    "function mintNFT(string memory tokenURI) external payable",
    "function balanceOf(address owner) external view returns (uint256)",
    "function getTotalFees() external view returns (uint256)",
    "event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 fee)"
];

let provider;
let signer;
let feeGeneratorContract;
let nftContract;
let userAddress;
let walletConnectProvider = null;
let refreshInterval = null;
let initialized = false;

// Initialize - Wait for DOM and scripts to be ready
(function() {
    function init() {
        if (initialized) {
            console.log('Already initialized, skipping...');
            return;
        }
        
        console.log('DOM loaded, initializing...');
        try {
            initWeb3();
            setupEventListeners();
            initialized = true;
            console.log('Initialization complete');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();

async function initWeb3() {
    console.log('Initializing Web3...');
    
    // Check for existing connection
    if (typeof window.ethereum !== 'undefined') {
        console.log('Ethereum provider found');
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Provider created');
            
            // Check if already connected
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
                await handleWalletConnected(accounts[0]);
            }
        } catch (error) {
            console.error('Error creating provider:', error);
        }
    } else {
        console.warn('No Ethereum provider found');
    }
}

async function checkNetwork() {
    if (!provider) return;
    
    try {
        const network = await provider.getNetwork();
        const baseChainId = 8453;
        const baseSepoliaChainId = 84532;
        
        if (network.chainId !== baseChainId && network.chainId !== baseSepoliaChainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${baseChainId.toString(16)}` }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await addBaseNetwork();
                }
            }
        }
    } catch (error) {
        console.error('Network check error:', error);
    }
}

async function addBaseNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
            }]
        });
    } catch (error) {
        console.error('Error adding network:', error);
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    const connectBtn = document.getElementById('connectWallet');
    const disconnectBtn = document.getElementById('disconnectWallet');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const mintBtn = document.getElementById('mintNFTBtn');
    
    if (connectBtn) {
        connectBtn.onclick = async function(e) {
            e.preventDefault();
            e.stopPropagation();
            await connectWallet();
            return false;
        };
        console.log('✅ Connect wallet button listener added');
    }
    
    if (disconnectBtn) {
        disconnectBtn.onclick = async function(e) {
            e.preventDefault();
            await disconnectWallet();
        };
    }
    
    if (depositBtn) {
        depositBtn.addEventListener('click', deposit);
    }
    
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', withdraw);
    }
    
    if (mintBtn) {
        mintBtn.addEventListener('click', mintNFT);
    }
    
    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        handleWalletConnected(accounts[0]);
    }
}

function handleChainChanged(chainId) {
    window.location.reload();
}

async function connectWallet() {
    console.log('=== Connect wallet function called ===');
    
    const connectBtn = document.getElementById('connectWallet');
    
    try {
        if (connectBtn) {
            connectBtn.textContent = 'Connecting...';
            connectBtn.disabled = true;
            connectBtn.style.opacity = '0.6';
        }
        
        // Try WalletConnect first, then fallback to injected provider
        if (typeof window.ethereum !== 'undefined') {
            // Use injected provider (MetaMask, etc)
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts returned');
            }
            
            await handleWalletConnected(accounts[0]);
        } else {
            throw new Error('No wallet provider found. Please install MetaMask or use WalletConnect.');
        }
        
    } catch (error) {
        console.error('❌ Error connecting wallet:', error);
        
        if (connectBtn) {
            connectBtn.textContent = 'Hubungkan Dompet';
            connectBtn.disabled = false;
            connectBtn.style.opacity = '1';
        }
        
        let errorMsg = 'Failed to connect wallet';
        
        if (error.code === 4001) {
            errorMsg = 'Connection rejected. Please approve in your wallet.';
        } else if (error.code === -32002) {
            errorMsg = 'Connection request pending. Check your wallet.';
        } else if (error.message) {
            errorMsg = error.message;
        }
        
        alert(errorMsg);
    }
}

async function handleWalletConnected(address) {
    try {
        userAddress = address;
        
        // Initialize provider if not already
        if (!provider && window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        
        if (!provider) {
            throw new Error('Provider not available');
        }
        
        signer = provider.getSigner();
        console.log('Connected to address:', userAddress);
        
        // Check and switch network
        await checkNetwork();
        
        // Initialize contracts
        if (FEE_GENERATOR_ADDRESS && FEE_GENERATOR_ADDRESS !== '0x...') {
            feeGeneratorContract = new ethers.Contract(FEE_GENERATOR_ADDRESS, FEE_GENERATOR_ABI, signer);
            console.log('FeeGenerator contract initialized');
        }
        
        if (NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x...') {
            nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
            console.log('NFT contract initialized');
        }
        
        // Update UI
        const walletAddressEl = document.getElementById('walletAddress');
        const walletInfoEl = document.getElementById('walletInfo');
        const connectBtn = document.getElementById('connectWallet');
        const disconnectBtn = document.getElementById('disconnectWallet');
        
        if (walletAddressEl) {
            walletAddressEl.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        }
        
        if (walletInfoEl) {
            walletInfoEl.classList.remove('hidden');
        }
        
        if (disconnectBtn) {
            disconnectBtn.style.display = 'block';
        }
        
        if (connectBtn) {
            connectBtn.textContent = 'Connected ✓';
            connectBtn.disabled = true;
            connectBtn.style.opacity = '1';
        }
        
        // Load data
        await loadWalletData();
        if (feeGeneratorContract) {
            await loadContractData();
        }
        
        // Setup contract event listeners
        if (feeGeneratorContract) {
            setupContractListeners();
        }
        
        // Start auto-refresh
        startAutoRefresh();
        
        console.log('✅ Wallet connected successfully!');
        
    } catch (error) {
        console.error('Error handling wallet connection:', error);
        throw error;
    }
}

async function disconnectWallet() {
    try {
        // Stop auto-refresh
        stopAutoRefresh();
        
        // Clear contracts
        feeGeneratorContract = null;
        nftContract = null;
        signer = null;
        userAddress = null;
        
        // Update UI
        const walletInfoEl = document.getElementById('walletInfo');
        const connectBtn = document.getElementById('connectWallet');
        const disconnectBtn = document.getElementById('disconnectWallet');
        
        if (walletInfoEl) {
            walletInfoEl.classList.add('hidden');
        }
        
        if (disconnectBtn) {
            disconnectBtn.style.display = 'none';
        }
        
        if (connectBtn) {
            connectBtn.textContent = 'Hubungkan Dompet';
            connectBtn.disabled = false;
            connectBtn.style.opacity = '1';
        }
        
        console.log('✅ Wallet disconnected');
    } catch (error) {
        console.error('Error disconnecting wallet:', error);
    }
}

async function loadWalletData() {
    if (!userAddress || !provider) return;
    
    try {
        const balance = await provider.getBalance(userAddress);
        const balanceEl = document.getElementById('walletBalance');
        if (balanceEl) {
            balanceEl.textContent = ethers.utils.formatEther(balance).slice(0, 6);
        }
    } catch (error) {
        console.error('Error loading wallet data:', error);
    }
}

async function loadContractData() {
    if (!feeGeneratorContract) return;
    
    try {
        // Fee Generator stats
        const userBalance = await feeGeneratorContract.getBalance();
        const totalFees = await feeGeneratorContract.getTotalFees();
        
        const userBalanceEl = document.getElementById('userBalance');
        const totalFeesEl = document.getElementById('totalFees');
        
        if (userBalanceEl) {
            userBalanceEl.textContent = ethers.utils.formatEther(userBalance).slice(0, 6) + ' ETH';
        }
        if (totalFeesEl) {
            totalFeesEl.textContent = ethers.utils.formatEther(totalFees).slice(0, 6) + ' ETH';
        }
        
        // NFT stats (only if contract exists)
        if (nftContract && userAddress) {
            try {
                const nftBalance = await nftContract.balanceOf(userAddress);
                const nftFees = await nftContract.getTotalFees();
                
                const userNFTsEl = document.getElementById('userNFTs');
                const nftFeesEl = document.getElementById('nftFees');
                
                if (userNFTsEl) {
                    userNFTsEl.textContent = nftBalance.toString();
                }
                if (nftFeesEl) {
                    nftFeesEl.textContent = ethers.utils.formatEther(nftFees).slice(0, 6) + ' ETH';
                }
            } catch (nftError) {
                console.warn('NFT contract not available:', nftError);
            }
        }
    } catch (error) {
        console.error('Error loading contract data:', error);
    }
}

function setupContractListeners() {
    if (!feeGeneratorContract) return;
    
    try {
        // Remove old listeners first to prevent duplicates
        feeGeneratorContract.removeAllListeners('Deposit');
        feeGeneratorContract.removeAllListeners('Withdraw');
        
        // Listen for deposit events
        feeGeneratorContract.on('Deposit', (user, amount, fee) => {
            try {
                if (user && userAddress && user.toLowerCase() === userAddress.toLowerCase()) {
                    addTransaction('Deposit successful', amount, fee, true);
                    setTimeout(() => loadContractData(), 1000);
                }
            } catch (error) {
                console.error('Deposit event error:', error);
            }
        });
        
        // Listen for withdraw events
        feeGeneratorContract.on('Withdraw', (user, amount, fee) => {
            try {
                if (user && userAddress && user.toLowerCase() === userAddress.toLowerCase()) {
                    addTransaction('Withdraw successful', amount, fee, true);
                    setTimeout(() => loadContractData(), 1000);
                }
            } catch (error) {
                console.error('Withdraw event error:', error);
            }
        });
        
        // Listen for NFT mint events (if contract exists)
        if (nftContract) {
            nftContract.removeAllListeners('NFTMinted');
            nftContract.on('NFTMinted', (to, tokenId, fee) => {
                try {
                    if (to && userAddress && to.toLowerCase() === userAddress.toLowerCase()) {
                        addTransaction(`NFT #${tokenId} minted`, fee, null, true);
                        setTimeout(() => loadContractData(), 1000);
                    }
                } catch (error) {
                    console.error('NFT mint event error:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error setting up contract listeners:', error);
    }
}

async function deposit() {
    if (!feeGeneratorContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const amount = document.getElementById('depositAmount');
    if (!amount || !amount.value) {
        alert('Please enter an amount');
        return;
    }
    
    const amountValue = amount.value;
    const minDeposit = CONFIG?.fees?.minDeposit || "0.001";
    
    if (parseFloat(amountValue) < parseFloat(minDeposit)) {
        alert(`Minimum deposit is ${minDeposit} ETH`);
        return;
    }
    
    const depositBtn = document.getElementById('depositBtn');
    
    try {
        if (depositBtn) {
            depositBtn.disabled = true;
            depositBtn.textContent = 'Processing...';
        }
        
        const tx = await feeGeneratorContract.deposit({
            value: ethers.utils.parseEther(amountValue)
        });
        
        addTransaction('Deposit pending...', amountValue, null, false);
        
        await tx.wait();
        addTransaction('Deposit confirmed!', amountValue, null, true);
        
        if (amount) {
            amount.value = '';
        }
        
        await loadContractData();
        await loadWalletData();
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

async function withdraw() {
    if (!feeGeneratorContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const amount = document.getElementById('withdrawAmount');
    if (!amount || !amount.value) {
        alert('Please enter an amount');
        return;
    }
    
    const amountValue = amount.value;
    
    if (parseFloat(amountValue) <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const withdrawBtn = document.getElementById('withdrawBtn');
    
    try {
        if (withdrawBtn) {
            withdrawBtn.disabled = true;
            withdrawBtn.textContent = 'Processing...';
        }
        
        const tx = await feeGeneratorContract.withdraw(ethers.utils.parseEther(amountValue));
        
        addTransaction('Withdraw pending...', amountValue, null, false);
        
        await tx.wait();
        addTransaction('Withdraw confirmed!', amountValue, null, true);
        
        if (amount) {
            amount.value = '';
        }
        
        await loadContractData();
        await loadWalletData();
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

async function mintNFT() {
    if (!nftContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const tokenURI = document.getElementById('nftURI');
    const tokenURIValue = tokenURI ? tokenURI.value : "https://example.com/metadata.json";
    const mintPriceStr = CONFIG?.fees?.nftMintPrice || "0.001";
    const mintPrice = ethers.utils.parseEther(mintPriceStr);
    
    const mintBtn = document.getElementById('mintNFTBtn');
    
    try {
        if (mintBtn) {
            mintBtn.disabled = true;
            mintBtn.textContent = 'Minting...';
        }
        
        const tx = await nftContract.mintNFT(tokenURIValue, { value: mintPrice });
        
        addTransaction(`Minting NFT...`, mintPriceStr, null, false);
        
        await tx.wait();
        addTransaction('NFT minted successfully!', mintPriceStr, null, true);
        
        if (tokenURI) {
            tokenURI.value = '';
        }
        
        await loadContractData();
        await loadWalletData();
    } catch (error) {
        console.error('Mint error:', error);
        addTransaction('Mint failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (mintBtn) {
            mintBtn.disabled = false;
            mintBtn.textContent = 'Mint NFT';
        }
    }
}

function addTransaction(message, amount, fee, success) {
    const transactionsDiv = document.getElementById('transactions');
    if (!transactionsDiv) return;
    
    const transactionDiv = document.createElement('div');
    transactionDiv.className = `transaction-item ${success ? 'success' : ''}`;
    
    let html = `<p><strong>${message}</strong></p>`;
    if (amount) {
        html += `<p>Amount: ${amount} ETH</p>`;
    }
    if (fee) {
        html += `<p>Fee: ${ethers.utils.formatEther(fee).slice(0, 6)} ETH</p>`;
    }
    html += `<p class="transaction-time">${new Date().toLocaleTimeString()}</p>`;
    
    transactionDiv.innerHTML = html;
    transactionsDiv.insertBefore(transactionDiv, transactionsDiv.firstChild);
    
    // Keep only last 10 transactions
    while (transactionsDiv.children.length > 10) {
        transactionsDiv.removeChild(transactionsDiv.lastChild);
    }
}

function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
        if (userAddress && provider) {
            try {
                loadContractData();
                loadWalletData();
            } catch (error) {
                console.error('Auto-refresh error:', error);
            }
        }
    }, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}
