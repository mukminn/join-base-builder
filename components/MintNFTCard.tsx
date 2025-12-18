'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { AnimatedCard } from './AnimatedCard';
import { CONTRACT_ADDRESSES } from '@/lib/wagmi';
import { NFTMINT_ABI } from '@/lib/contracts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const MINT_PRICE = '0.001';

export function MintNFTCard() {
  const { address, isConnected } = useAccount();
  const [tokenURI, setTokenURI] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.NFTMint as `0x${string}`,
    abi: NFTMINT_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!CONTRACT_ADDRESSES.NFTMint && CONTRACT_ADDRESSES.NFTMint !== '0x...' },
  });

  const { data: remainingSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.NFTMint as `0x${string}`,
    abi: NFTMINT_ABI,
    functionName: 'remainingSupply',
    query: { enabled: !!CONTRACT_ADDRESSES.NFTMint && CONTRACT_ADDRESSES.NFTMint !== '0x...' },
  });

  const { data: userMintCount } = useReadContract({
    address: CONTRACT_ADDRESSES.NFTMint as `0x${string}`,
    abi: NFTMINT_ABI,
    functionName: 'getUserMintCount',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected && !!CONTRACT_ADDRESSES.NFTMint && CONTRACT_ADDRESSES.NFTMint !== '0x...' },
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const uri = tokenURI || `https://api.example.com/metadata/${Date.now()}`;
      const value = parseEther(MINT_PRICE);
      
      writeContract({
        address: CONTRACT_ADDRESSES.NFTMint as `0x${string}`,
        abi: NFTMINT_ABI,
        functionName: 'mint',
        args: [uri],
        value,
      });
    } catch (error: any) {
      toast.error(error?.message || 'Mint failed');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    toast.success('NFT minted successfully!');
    setTokenURI('');
    setIsLoading(false);
  }

  return (
    <AnimatedCard>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎨</div>
          <div>
            <h2 className="text-xl font-bold">Mint NFT</h2>
            <p className="text-sm text-gray-400">
              Price: {MINT_PRICE} ETH | 
              {totalSupply !== undefined && remainingSupply !== undefined && (
                <> {totalSupply.toString()} / {remainingSupply.toString()} remaining</>
              )}
            </p>
            {userMintCount !== undefined && (
              <p className="text-xs text-neon-cyan">You minted: {userMintCount.toString()}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Token URI (optional)"
            value={tokenURI}
            onChange={(e) => setTokenURI(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-base-card border border-base-border text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition"
            disabled={!isConnected || isLoading || isPending}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMint}
            disabled={!isConnected || isLoading || isPending || (remainingSupply !== undefined && remainingSupply === 0n)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan text-white font-semibold neon-glow ripple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isPending ? 'Minting...' : `Mint NFT (${MINT_PRICE} ETH)`}
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
}
