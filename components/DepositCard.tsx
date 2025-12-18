'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { AnimatedCard } from './AnimatedCard';
import { CONTRACT_ADDRESSES } from '@/lib/wagmi';
import { ETHVAULT_ABI } from '@/lib/contracts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function DepositCard() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: userBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.ETHVault as `0x${string}`,
    abi: ETHVAULT_ABI,
    functionName: 'getBalance',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected },
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleDeposit = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      const value = parseEther(amount);
      
      writeContract({
        address: CONTRACT_ADDRESSES.ETHVault as `0x${string}`,
        abi: ETHVAULT_ABI,
        functionName: 'deposit',
        value,
      });
    } catch (error: any) {
      toast.error(error?.message || 'Deposit failed');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    toast.success('Deposit successful!');
    setAmount('');
    setIsLoading(false);
  }

  return (
    <AnimatedCard>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💵</div>
          <div>
            <h2 className="text-xl font-bold">Deposit ETH</h2>
            <p className="text-sm text-gray-400">Your Balance: {userBalance ? formatEther(userBalance) : '0'} ETH</p>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="number"
            placeholder="Amount (ETH)"
            step="0.001"
            min="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-base-card border border-base-border text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition"
            disabled={!isConnected || isLoading || isPending}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeposit}
            disabled={!isConnected || isLoading || isPending || !amount}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold neon-glow ripple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isPending ? 'Processing...' : 'Deposit'}
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
}
