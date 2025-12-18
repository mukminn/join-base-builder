// Optimized and lightweight wallet connection
// Load configuration
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

// Minimal ABI
const FEE_GENERATOR_ABI = [
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

// Global state
let provider, signer, feeGeneratorContract, nftContract, userAddress;
let refreshInterval = null;
let initialized = false;
let walletConnectProvider = null;

// Initialize only when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    setTimeout(init, 50);
}

function init() {
    if (initialized) return;
    initialized = true;
    
    try {
        setupEventListeners();
        setupWalletModal();
        checkExistingConnection();
    } catch (error) {
        console.error('Init error:', error);
    }
}

function setupEventListeners() {
    const connectBtn = document.getElementById('connectWallet');
    const disconnectBtn = document.getElementById('disconnectWallet');
    const closeModal = document.getElementById('closeWalletModal');
    const modal = document.getElementById('walletModal');
    
    if (connectBtn) {
        connectBtn.onclick = () => showWalletModal();
    }
    
    if (disconnectBtn) {
        disconnectBtn.onclick = disconnectWallet;
    }
    
    if (closeModal) {
        closeModal.onclick = hideWalletModal;
    }
    
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) hideWalletModal();
        };
    }
    
    // Contract buttons - lazy load
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const mintBtn = document.getElementById('mintNFTBtn');
    
    if (depositBtn) depositBtn.onclick = deposit;
    if (withdrawBtn) withdrawBtn.onclick = withdraw;
    if (mintBtn) mintBtn.onclick = mintNFT;
    
    // Wallet events
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
}

function setupWalletModal() {
    const installedWallets = document.getElementById('installedWallets');
    const popularWallets = document.getElementById('popularWallets');
    
    if (!installedWallets || !popularWallets) return;
    
    // Installed wallets
    const installed = [
        { id: 'metamask', name: 'MetaMask', icon: '🦊', installed: checkInstalled('isMetaMask') },
        { id: 'rabby', name: 'Rabby Wallet', icon: '🐰', installed: checkInstalled('isRabby') }
    ];
    
    // Popular wallets
    const popular = [
        { id: 'safe', name: 'Safe', icon: '🛡️', installed: false },
        { id: 'farcaster', name: 'Farcaster', icon: '📡', installed: false }
    ];
    
    installedWallets.innerHTML = installed.map(w => createWalletItem(w)).join('');
    popularWallets.innerHTML = popular.map(w => createWalletItem(w)).join('');
    
    // Setup wallet clicks
    installed.concat(popular).forEach(wallet => {
        const el = document.getElementById(`wallet-${wallet.id}`);
        if (el) {
            el.onclick = () => selectWallet(wallet.id);
        }
    });
    
    // Social login
    const googleBtn = document.getElementById('googleLogin');
    const emailBtn = document.getElementById('emailLogin');
    
    if (googleBtn) googleBtn.onclick = () => connectWithEmail('google');
    if (emailBtn) emailBtn.onclick = () => connectWithEmail('email');
    
    // WalletConnect QR - lazy load
    loadWalletConnectQR();
}

function checkInstalled(prop) {
    return typeof window.ethereum !== 'undefined' && window.ethereum[prop];
}

function createWalletItem(wallet) {
    const installedClass = wallet.installed ? '' : 'disabled';
    return `
        <div id="wallet-${wallet.id}" class="wallet-item ${installedClass}">
            <div class="wallet-icon">${wallet.icon}</div>
            <div class="wallet-name">${wallet.name}</div>
            ${wallet.installed ? '<span class="installed-badge">installed</span>' : ''}
        </div>
    `;
}

async function loadWalletConnectQR() {
    const qrContainer = document.getElementById('walletConnectQR');
    if (!qrContainer) return;
    
    try {
        // Simple QR placeholder - in production, use WalletConnect SDK
        qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <div class="qr-code">📱</div>
                <p>Scan with your wallet app</p>
                <button class="btn-small" onclick="initWalletConnect()">Generate QR</button>
            </div>
        `;
    } catch (error) {
        console.error('QR load error:', error);
    }
}

async function initWalletConnect() {
    try {
        // WalletConnect initialization would go here
        // For now, show message
        alert('WalletConnect QR will be generated here. In production, use @walletconnect/ethereum-provider');
    } catch (error) {
        console.error('WalletConnect init error:', error);
    }
}

function showWalletModal() {
    const modal = document.getElementById('walletModal');
    if (modal) modal.classList.remove('hidden');
}

function hideWalletModal() {
    const modal = document.getElementById('walletModal');
    if (modal) modal.classList.add('hidden');
}

function selectWallet(walletId) {
    hideWalletModal();
    
    if (walletId === 'metamask' || walletId === 'rabby') {
        connectInjectedWallet();
    } else if (walletId === 'safe') {
        alert('Safe wallet integration coming soon!');
    } else if (walletId === 'farcaster') {
        alert('Farcaster integration coming soon!');
    } else {
        alert(`${walletId} support coming soon!`);
    }
}

async function connectInjectedWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('No wallet found. Please install MetaMask or Rabby Wallet.');
        return;
    }
    
    const connectBtn = document.getElementById('connectWallet');
    
    try {
        if (connectBtn) {
            connectBtn.disabled = true;
            connectBtn.textContent = 'Connecting...';
        }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned');
        }
        
        await handleWalletConnected(accounts[0]);
        
    } catch (error) {
        console.error('Connect error:', error);
        alert(error.code === 4001 ? 'Connection rejected' : error.message || 'Connection failed');
    } finally {
        if (connectBtn) {
            connectBtn.disabled = false;
            connectBtn.textContent = 'Connect Wallet';
        }
    }
}

async function connectWithEmail(method) {
    hideWalletModal();
    alert(`${method === 'google' ? 'Google' : 'Email'} login coming soon! This will use WalletConnect email/Google auth.`);
}

async function handleWalletConnected(address) {
    try {
        userAddress = address;
        
        // Lazy load ethers only when needed
        if (typeof ethers === 'undefined') {
            await loadEthers();
        }
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        await checkNetwork();
        
        if (FEE_GENERATOR_ADDRESS && FEE_GENERATOR_ADDRESS !== '0x...') {
            feeGeneratorContract = new ethers.Contract(FEE_GENERATOR_ADDRESS, FEE_GENERATOR_ABI, signer);
        }
        
        if (NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== '0x...') {
            nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
        }
        
        updateUI();
        await loadData();
        setupContractListeners();
        startAutoRefresh();
        
    } catch (error) {
        console.error('Handle connection error:', error);
        throw error;
    }
}

function loadEthers() {
    return new Promise((resolve) => {
        if (typeof ethers !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
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
    const walletAddressEl = document.getElementById('walletAddress');
    const walletInfoEl = document.getElementById('walletInfo');
    const connectBtn = document.getElementById('connectWallet');
    const disconnectBtn = document.getElementById('disconnectWallet');
    
    if (walletAddressEl && userAddress) {
        walletAddressEl.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    }
    
    if (walletInfoEl) walletInfoEl.classList.remove('hidden');
    if (disconnectBtn) disconnectBtn.style.display = 'block';
    if (connectBtn) {
        connectBtn.textContent = 'Connected ✓';
        connectBtn.disabled = true;
    }
}

async function loadData() {
    if (!userAddress || !provider) return;
    
    try {
        const balance = await provider.getBalance(userAddress);
        const balanceEl = document.getElementById('walletBalance');
        if (balanceEl) {
            balanceEl.textContent = ethers.utils.formatEther(balance).slice(0, 6);
        }
        
        if (feeGeneratorContract) {
            const [userBalance, totalFees] = await Promise.all([
                feeGeneratorContract.getBalance(),
                feeGeneratorContract.getTotalFees()
            ]);
            
            const userBalanceEl = document.getElementById('userBalance');
            const totalFeesEl = document.getElementById('totalFees');
            
            if (userBalanceEl) userBalanceEl.textContent = ethers.utils.formatEther(userBalance).slice(0, 6) + ' ETH';
            if (totalFeesEl) totalFeesEl.textContent = ethers.utils.formatEther(totalFees).slice(0, 6) + ' ETH';
        }
        
        if (nftContract && userAddress) {
            try {
                const [nftBalance, nftFees] = await Promise.all([
                    nftContract.balanceOf(userAddress),
                    nftContract.getTotalFees()
                ]);
                
                const userNFTsEl = document.getElementById('userNFTs');
                const nftFeesEl = document.getElementById('nftFees');
                
                if (userNFTsEl) userNFTsEl.textContent = nftBalance.toString();
                if (nftFeesEl) nftFeesEl.textContent = ethers.utils.formatEther(nftFees).slice(0, 6) + ' ETH';
            } catch (e) {
                console.warn('NFT data error:', e);
            }
        }
    } catch (error) {
        console.error('Load data error:', error);
    }
}

function setupContractListeners() {
    if (!feeGeneratorContract) return;
    
    try {
        feeGeneratorContract.removeAllListeners();
        
        feeGeneratorContract.on('Deposit', (user, amount, fee) => {
            if (user && userAddress && user.toLowerCase() === userAddress.toLowerCase()) {
                addTransaction('Deposit successful', amount, fee, true);
                setTimeout(loadData, 1000);
            }
        });
        
        feeGeneratorContract.on('Withdraw', (user, amount, fee) => {
            if (user && userAddress && user.toLowerCase() === userAddress.toLowerCase()) {
                addTransaction('Withdraw successful', amount, fee, true);
                setTimeout(loadData, 1000);
            }
        });
        
        if (nftContract) {
            nftContract.removeAllListeners('NFTMinted');
            nftContract.on('NFTMinted', (to, tokenId, fee) => {
                if (to && userAddress && to.toLowerCase() === userAddress.toLowerCase()) {
                    addTransaction(`NFT #${tokenId} minted`, fee, null, true);
                    setTimeout(loadData, 1000);
                }
            });
        }
    } catch (error) {
        console.error('Setup listeners error:', error);
    }
}

async function checkExistingConnection() {
    if (typeof window.ethereum === 'undefined') return;
    
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
            await handleWalletConnected(accounts[0]);
        }
    } catch (error) {
        console.error('Check connection error:', error);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        handleWalletConnected(accounts[0]);
    }
}

async function disconnectWallet() {
    stopAutoRefresh();
    feeGeneratorContract = null;
    nftContract = null;
    signer = null;
    userAddress = null;
    
    const walletInfoEl = document.getElementById('walletInfo');
    const connectBtn = document.getElementById('connectWallet');
    const disconnectBtn = document.getElementById('disconnectWallet');
    
    if (walletInfoEl) walletInfoEl.classList.add('hidden');
    if (disconnectBtn) disconnectBtn.style.display = 'none';
    if (connectBtn) {
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.disabled = false;
    }
}

async function deposit() {
    if (!feeGeneratorContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const amountEl = document.getElementById('depositAmount');
    if (!amountEl || !amountEl.value) {
        alert('Please enter an amount');
        return;
    }
    
    const amount = amountEl.value;
    const minDeposit = CONFIG?.fees?.minDeposit || "0.001";
    
    if (parseFloat(amount) < parseFloat(minDeposit)) {
        alert(`Minimum deposit is ${minDeposit} ETH`);
        return;
    }
    
    const btn = document.getElementById('depositBtn');
    
    try {
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Processing...';
        }
        
        const tx = await feeGeneratorContract.deposit({
            value: ethers.utils.parseEther(amount)
        });
        
        addTransaction('Deposit pending...', amount, null, false);
        await tx.wait();
        addTransaction('Deposit confirmed!', amount, null, true);
        
        amountEl.value = '';
        await loadData();
    } catch (error) {
        console.error('Deposit error:', error);
        addTransaction('Deposit failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Deposit';
        }
    }
}

async function withdraw() {
    if (!feeGeneratorContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const amountEl = document.getElementById('withdrawAmount');
    if (!amountEl || !amountEl.value) {
        alert('Please enter an amount');
        return;
    }
    
    const amount = amountEl.value;
    const btn = document.getElementById('withdrawBtn');
    
    try {
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Processing...';
        }
        
        const tx = await feeGeneratorContract.withdraw(ethers.utils.parseEther(amount));
        addTransaction('Withdraw pending...', amount, null, false);
        await tx.wait();
        addTransaction('Withdraw confirmed!', amount, null, true);
        
        amountEl.value = '';
        await loadData();
    } catch (error) {
        console.error('Withdraw error:', error);
        addTransaction('Withdraw failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Withdraw';
        }
    }
}

async function mintNFT() {
    if (!nftContract) {
        alert('Please connect wallet first!');
        return;
    }
    
    const tokenURIEl = document.getElementById('nftURI');
    const tokenURI = tokenURIEl ? tokenURIEl.value : "https://example.com/metadata.json";
    const mintPrice = ethers.utils.parseEther(CONFIG?.fees?.nftMintPrice || "0.001");
    const btn = document.getElementById('mintNFTBtn');
    
    try {
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Minting...';
        }
        
        const tx = await nftContract.mintNFT(tokenURI, { value: mintPrice });
        addTransaction('Minting NFT...', CONFIG?.fees?.nftMintPrice || "0.001", null, false);
        await tx.wait();
        addTransaction('NFT minted successfully!', CONFIG?.fees?.nftMintPrice || "0.001", null, true);
        
        if (tokenURIEl) tokenURIEl.value = '';
        await loadData();
    } catch (error) {
        console.error('Mint error:', error);
        addTransaction('Mint failed: ' + (error.message || 'Unknown error'), null, null, false);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Mint NFT';
        }
    }
}

function addTransaction(message, amount, fee, success) {
    const transactionsDiv = document.getElementById('transactions');
    if (!transactionsDiv) return;
    
    const div = document.createElement('div');
    div.className = `transaction-item ${success ? 'success' : ''}`;
    
    let html = `<p><strong>${message}</strong></p>`;
    if (amount) html += `<p>Amount: ${amount} ETH</p>`;
    if (fee) html += `<p>Fee: ${ethers.utils.formatEther(fee).slice(0, 6)} ETH</p>`;
    html += `<p class="transaction-time">${new Date().toLocaleTimeString()}</p>`;
    
    div.innerHTML = html;
    transactionsDiv.insertBefore(div, transactionsDiv.firstChild);
    
    // Keep only last 10
    while (transactionsDiv.children.length > 10) {
        transactionsDiv.removeChild(transactionsDiv.lastChild);
    }
}

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    
    refreshInterval = setInterval(() => {
        if (userAddress && provider) {
            loadData().catch(err => console.error('Refresh error:', err));
        }
    }, 30000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Expose for QR button
window.initWalletConnect = initWalletConnect;
