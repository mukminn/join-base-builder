// Simple app without wallet connection
// Just display contract info and stats

const CONFIG = window.CONFIG || {
    contracts: {
        feeGenerator: "0x33b5b0136bD1812E644eBC089af88706C9A3815d",
        simpleNFT: "0x..."
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Update contract address display
    const feeContractAddr = document.getElementById('feeContractAddr');
    if (feeContractAddr) {
        feeContractAddr.textContent = CONFIG.contracts.feeGenerator;
    }
    
    // Simulate loading stats (in real app, fetch from contract)
    loadStats();
    
    // Update activity periodically
    setInterval(updateActivity, 30000);
}

function loadStats() {
    // In production, these would be fetched from the contract
    // For now, display placeholder values
    
    const stats = {
        totalFees: "0.0",
        totalDeposits: "0.0",
        totalNFTs: "0",
        nftFees: "0.0"
    };
    
    // Update UI
    updateStat('totalFees', stats.totalFees + ' ETH');
    updateStat('totalDeposits', stats.totalDeposits + ' ETH');
    updateStat('totalNFTs', stats.totalNFTs);
    updateStat('nftFees', stats.nftFees + ' ETH');
}

function updateStat(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateActivity() {
    // Simulate new activity
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    // In production, fetch from contract events
    // For now, just keep existing activities
}

// Add smooth animations
function animateOnScroll() {
    const cards = document.querySelectorAll('.stat-card, .step-card, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Initialize animations
setTimeout(animateOnScroll, 100);

// Copy contract address to clipboard
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('info-value') || e.target.closest('.info-value')) {
        const address = CONFIG.contracts.feeGenerator;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(address).then(() => {
                showNotification('Contract address copied to clipboard!');
            });
        }
    }
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add network badge animation
const networkDot = document.querySelector('.network-dot');
if (networkDot) {
    setInterval(() => {
        networkDot.style.opacity = networkDot.style.opacity === '1' ? '0.5' : '1';
    }, 2000);
}
