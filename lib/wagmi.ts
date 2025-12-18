import { createConfig, http, createConnector } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base, baseSepolia } from 'wagmi/chains';

// Base Mini App connector (embedded wallet)
// Auto-detect Base wallet or fallback to MetaMask
const baseConnector = injected({
  target: 'metaMask',
});

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    baseConnector,
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  ssr: true,
});

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  ETHVault: process.env.NEXT_PUBLIC_ETHVAULT_ADDRESS || '0x...',
  NFTMint: process.env.NEXT_PUBLIC_NFTMINT_ADDRESS || '0x...',
} as const;
