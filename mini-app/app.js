// Load configuration
let CONFIG;
if (typeof CONFIG === 'undefined') {
    // Fallback jika config.js tidak loaded
    CONFIG = {
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
}

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initWeb3();
    setupEventListeners();
});

async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await checkNetwork();
    } else {
        alert('Please install MetaMask or another Web3 wallet!');
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
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('depositBtn').addEventListener('click', deposit);
    document.getElementById('withdrawBtn').addEventListener('click', withdraw);
    document.getElementById('mintNFTBtn').addEventListener('click', mintNFT);
}

async function connectWallet() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        // Initialize contracts
        feeGeneratorContract = new ethers.Contract(FEE_GENERATOR_ADDRESS, FEE_GENERATOR_ABI, signer);
        nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
        
        // Update UI
        document.getElementById('walletAddress').textContent = 
            `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        document.getElementById('walletInfo').classList.remove('hidden');
        document.getElementById('connectWallet').textContent = 'Connected';
        document.getElementById('connectWallet').disabled = true;
        
        // Load data
        await loadWalletData();
        await loadContractData();
        
        // Setup listeners
        setupContractListeners();
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
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

// Auto-refresh data every 30 seconds
setInterval(() => {
    if (userAddress) {
        loadContractData();
        loadWalletData();
    }
}, 30000);
