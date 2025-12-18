'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Auto connect Base wallet
  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      const baseConnector = connectors.find(c => c.id === 'base') || connectors[0];
      if (baseConnector) {
        connect({ connector: baseConnector });
      }
    }
  }, [isConnected, connectors, connect]);

  // Auto switch to Base if not on Base
  useEffect(() => {
    if (isConnected && chainId !== base.id && chainId !== baseSepolia.id) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chainId, switchChain]);

  if (isConnected && address) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => disconnect()}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold neon-glow ripple"
      >
        Disconnect
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const baseConnector = connectors.find(c => c.id === 'base') || connectors[0];
        if (baseConnector) {
          connect({ connector: baseConnector });
        }
      }}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold neon-glow ripple"
    >
      Connect Wallet
    </motion.button>
  );
}
