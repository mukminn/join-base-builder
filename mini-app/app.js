// Load configuration - Fallback jika config.js tidak loaded
let CONFIG = window.CONFIG || {
    contracts: {
        feeGenerator: "0x33b5b0136bD1812E644eBC089af88706C9A3815d", // FeeGenerator deployed address
        simpleNFT: "0x..."      // Update dengan deployed address (jika sudah deploy)
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

// Make connectWallet globally accessible
window.connectWallet = connectWallet;

// Initialize - Wait for DOM and scripts to be ready
(function() {
    function init() {
        console.log('DOM loaded, initializing...');
        try {
            initWeb3();
            setupEventListeners();
            console.log('Initialization complete');
        } catch (error) {
            console.error('Initialization error:', error);
            alert('Error initializing app: ' + error.message);
        }
    }
    
    // If DOM already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        setTimeout(init, 100);
    }
})();

async function initWeb3() {
    console.log('Initializing Web3...');
    
    if (typeof window.ethereum !== 'undefined') {
        console.log('Ethereum provider found');
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Provider created');
            await checkNetwork();
        } catch (error) {
            console.error('Error creating provider:', error);
        }
    } else {
        console.warn('No Ethereum provider found');
        const connectBtn = document.getElementById('connectWallet');
        if (connectBtn) {
            connectBtn.textContent = 'Install MetaMask';
            connectBtn.onclick = () => {
                window.open('https://metamask.io/download/', '_blank');
            };
        }
    }
}

async function checkNetwork() {
    const network = await provider.getNetwork();
    const baseChainId = 8453; // Base Mainnet
    const baseSepoliaChainId = 84532; // Base Sepolia
    
    if (network.chainId !== baseChainId && network.chainId !== baseSepoliaChainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${baseChainId.toString(16)}` }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                // Chain not added, add it
                await addBaseNetwork();
            }
        }
    }
}

async function addBaseNetwork() {
    await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
            chainId: '0x2105', // 8453 in hex
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
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    const connectBtn = document.getElementById('connectWallet');
    const walletModal = document.getElementById('walletModal');
    const closeModal = document.getElementById('closeWalletModal');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const mintBtn = document.getElementById('mintNFTBtn');
    
    if (connectBtn) {
        connectBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            showWalletModal();
            return false;
        };
        console.log('✅ Connect wallet button listener added');
    } else {
        console.error('❌ Connect wallet button not found!');
        setTimeout(setupEventListeners, 500);
    }
    
    if (closeModal) {
        closeModal.onclick = function() {
            hideWalletModal();
        };
    }
    
    if (walletModal) {
        walletModal.onclick = function(e) {
            if (e.target === walletModal) {
                hideWalletModal();
            }
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
    
    // Setup wallet options
    setupWalletOptions();
}

function showWalletModal() {
    const modal = document.getElementById('walletModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideWalletModal() {
    const modal = document.getElementById('walletModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function setupWalletOptions() {
    const installedWallets = document.getElementById('installedWallets');
    const popularWallets = document.getElementById('popularWallets');
    
    if (!installedWallets || !popularWallets) {
        console.warn('Wallet modal elements not found, retrying...');
        setTimeout(setupWalletOptions, 500);
        return;
    }
    
    // Check which wallets are installed
    const wallets = [
        {
            id: 'metamask',
            name: 'MetaMask',
            desc: 'Connect using MetaMask browser extension',
            icon: '🦊',
            installed: typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
            connect: connectMetaMask
        },
        {
            id: 'rabby',
            name: 'Rabby Wallet',
            desc: 'Connect using Rabby Wallet',
            icon: '🐰',
            installed: typeof window.ethereum !== 'undefined' && window.ethereum.isRabby,
            connect: connectMetaMask // Rabby uses same interface
        }
    ];
    
    const popular = [
        {
            id: 'rainbow',
            name: 'Rainbow',
            desc: 'Connect using Rainbow Wallet',
            icon: '🌈',
            installed: false,
            connect: () => alert('Rainbow Wallet support coming soon!')
        },
        {
            id: 'coinbase',
            name: 'Coinbase Wallet',
            desc: 'Connect using Coinbase Wallet',
            icon: '🔵',
            installed: typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet,
            connect: connectMetaMask
        },
        {
            id: 'walletconnect',
            name: 'WalletConnect',
            desc: 'Connect using WalletConnect',
            icon: '🔗',
            installed: false,
            connect: () => alert('WalletConnect support coming soon!')
        }
    ];
    
    // Render installed wallets
    try {
        installedWallets.innerHTML = wallets.map(wallet => {
            const onClick = wallet.installed ? `window.selectWallet('${wallet.id}')` : '';
            return `
                <div class="wallet-item ${!wallet.installed ? 'disabled' : ''}" ${onClick ? `onclick="${onClick}"` : ''}>
                    <div class="wallet-icon ${wallet.id}">${wallet.icon}</div>
                    <div class="wallet-info">
                        <div class="wallet-name">${wallet.name}</div>
                        <div class="wallet-desc">${wallet.desc}</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error rendering installed wallets:', error);
    }
    
    // Render popular wallets
    try {
        popularWallets.innerHTML = popular.map(wallet => {
            const onClick = wallet.installed ? `window.selectWallet('${wallet.id}')` : 'window.installWallet()';
            return `
                <div class="wallet-item ${!wallet.installed ? 'disabled' : ''}" onclick="${onClick}">
                    <div class="wallet-icon ${wallet.id}">${wallet.icon}</div>
                    <div class="wallet-info">
                        <div class="wallet-name">${wallet.name}</div>
                        <div class="wallet-desc">${wallet.desc}</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error rendering popular wallets:', error);
    }
}

function selectWallet(walletId) {
    console.log('Selected wallet:', walletId);
    hideWalletModal();
    
    if (walletId === 'metamask' || walletId === 'rabby' || walletId === 'coinbase') {
        connectMetaMask();
    } else {
        alert(`${walletId} support coming soon!`);
    }
}

// Expose globally
window.selectWallet = selectWallet;

function installWallet() {
    window.open('https://metamask.io/download/', '_blank');
}

// Expose globally
window.installWallet = installWallet;

function connectMetaMask() {
    // Use existing connectWallet function
    connectWallet();
}

// Expose globally
window.connectMetaMask = connectMetaMask;

async function connectWallet() {
    console.log('=== Connect wallet function called ===');
    console.log('window.ethereum:', typeof window.ethereum);
    
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask tidak terdeteksi!\n\nSilakan install MetaMask terlebih dahulu.');
        window.open('https://metamask.io/download/', '_blank');
        return;
    }
    
    const connectBtn = document.getElementById('connectWallet');
    
    try {
        console.log('Requesting accounts from MetaMask...');
        
        if (connectBtn) {
            connectBtn.textContent = 'Connecting...';
            connectBtn.disabled = true;
            connectBtn.style.opacity = '0.6';
        }
        
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        console.log('Accounts received:', accounts);
        
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned');
        }
        
        // Initialize provider
        if (!provider) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Provider created');
        }
        
        // Get signer
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        console.log('Connected to address:', userAddress);
        
        // Check and switch network
        await checkNetwork();
        
        // Initialize contracts
        if (FEE_GENERATOR_ADDRESS && FEE_GENERATOR_ADDRESS !== '0x...') {
            feeGeneratorContract = new ethers.Contract(FEE_GENERATOR_ADDRESS, FEE_GENERATOR_ABI, signer);
            console.log('FeeGenerator contract initialized at:', FEE_GENERATOR_ADDRESS);
        } else {
            console.warn('FeeGenerator address not set');
        }
        
        if (NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x...') {
            nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
            console.log('NFT contract initialized');
        }
        
        // Update UI
        const walletAddressEl = document.getElementById('walletAddress');
        const walletInfoEl = document.getElementById('walletInfo');
        
        if (walletAddressEl) {
            walletAddressEl.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        }
        
        if (walletInfoEl) {
            walletInfoEl.classList.remove('hidden');
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
        console.error('❌ Error connecting wallet:', error);
        
        if (connectBtn) {
            connectBtn.textContent = 'Connect Wallet';
            connectBtn.disabled = false;
            connectBtn.style.opacity = '1';
        }
        
        let errorMsg = 'Failed to connect wallet';
        
        if (error.code === 4001) {
            errorMsg = 'Connection rejected. Please approve in MetaMask.';
        } else if (error.code === -32002) {
            errorMsg = 'Connection request pending. Check MetaMask.';
        } else if (error.message) {
            errorMsg = error.message;
        }
        
        alert(errorMsg);
    }
}

async function loadWalletData() {
    if (!userAddress) return;
    
    const balance = await provider.getBalance(userAddress);
    document.getElementById('walletBalance').textContent = 
        ethers.utils.formatEther(balance).slice(0, 6);
}

async function loadContractData() {
    if (!feeGeneratorContract || !nftContract) return;
    
    try {
        // Fee Generator stats
        const userBalance = await feeGeneratorContract.getBalance();
        const totalFees = await feeGeneratorContract.getTotalFees();
        
        document.getElementById('userBalance').textContent = 
            ethers.utils.formatEther(userBalance).slice(0, 6) + ' ETH';
        document.getElementById('totalFees').textContent = 
            ethers.utils.formatEther(totalFees).slice(0, 6) + ' ETH';
        
        // NFT stats
        const nftBalance = await nftContract.balanceOf(userAddress);
        const nftFees = await nftContract.getTotalFees();
        
        document.getElementById('userNFTs').textContent = nftBalance.toString();
        document.getElementById('nftFees').textContent = 
            ethers.utils.formatEther(nftFees).slice(0, 6) + ' ETH';
    } catch (error) {
        console.error('Error loading contract data:', error);
    }
}

function setupContractListeners() {
    // Listen for deposit events
    feeGeneratorContract.on('Deposit', (user, amount, fee) => {
        if (user.toLowerCase() === userAddress.toLowerCase()) {
            addTransaction('Deposit successful', amount, fee, true);
            loadContractData();
        }
    });
    
    // Listen for withdraw events
    feeGeneratorContract.on('Withdraw', (user, amount, fee) => {
        if (user.toLowerCase() === userAddress.toLowerCase()) {
            addTransaction('Withdraw successful', amount, fee, true);
            loadContractData();
        }
    });
    
    // Listen for NFT mint events
    nftContract.on('NFTMinted', (to, tokenId, fee) => {
        if (to.toLowerCase() === userAddress.toLowerCase()) {
            addTransaction(`NFT #${tokenId} minted`, fee, null, true);
            loadContractData();
        }
    });
}

async function deposit() {
    if (!feeGeneratorContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const amount = document.getElementById('depositAmount').value;
    const minDeposit = CONFIG?.fees?.minDeposit || "0.001";
    if (!amount || parseFloat(amount) < parseFloat(minDeposit)) {
        alert(`Minimum deposit is ${minDeposit} ETH`);
        return;
    }
    
    try {
        const tx = await feeGeneratorContract.deposit({
            value: ethers.utils.parseEther(amount)
        });
        
        addTransaction('Deposit pending...', amount, null, false);
        document.getElementById('depositBtn').disabled = true;
        
        await tx.wait();
        addTransaction('Deposit confirmed!', amount, null, true);
        document.getElementById('depositBtn').disabled = false;
        document.getElementById('depositAmount').value = '';
        
        await loadContractData();
        await loadWalletData();
    } catch (error) {
        console.error('Deposit error:', error);
        addTransaction('Deposit failed: ' + error.message, null, null, false);
        document.getElementById('depositBtn').disabled = false;
    }
}

async function withdraw() {
    if (!feeGeneratorContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const amount = document.getElementById('withdrawAmount').value;
    if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    try {
        const tx = await feeGeneratorContract.withdraw(ethers.utils.parseEther(amount));
        
        addTransaction('Withdraw pending...', amount, null, false);
        document.getElementById('withdrawBtn').disabled = true;
        
        await tx.wait();
        addTransaction('Withdraw confirmed!', amount, null, true);
        document.getElementById('withdrawBtn').disabled = false;
        document.getElementById('withdrawAmount').value = '';
        
        await loadContractData();
        await loadWalletData();
    } catch (error) {
        console.error('Withdraw error:', error);
        addTransaction('Withdraw failed: ' + error.message, null, null, false);
        document.getElementById('withdrawBtn').disabled = false;
    }
}

async function mintNFT() {
    if (!nftContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const tokenURI = document.getElementById('nftURI').value || "https://example.com/metadata.json";
    const mintPriceStr = CONFIG?.fees?.nftMintPrice || "0.001";
    const mintPrice = ethers.utils.parseEther(mintPriceStr);
    
    try {
        const tx = await nftContract.mintNFT(tokenURI, { value: mintPrice });
        
        addTransaction(`Minting NFT...`, mintPriceStr, null, false);
        document.getElementById('mintNFTBtn').disabled = true;
        
        await tx.wait();
        addTransaction('NFT minted successfully!', mintPriceStr, null, true);
        document.getElementById('mintNFTBtn').disabled = false;
        document.getElementById('nftURI').value = '';
        
        await loadContractData();
        await loadWalletData();
    } catch (error) {
        console.error('Mint error:', error);
        addTransaction('Mint failed: ' + error.message, null, null, false);
        document.getElementById('mintNFTBtn').disabled = false;
    }
}

function addTransaction(message, amount, fee, success) {
    const transactionsDiv = document.getElementById('transactions');
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

// Auto-refresh data every 30 seconds (only if connected)
let refreshInterval = null;

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
