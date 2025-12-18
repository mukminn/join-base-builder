'use client';

import { WalletButton } from '@/components/WalletButton';
import { DepositCard } from '@/components/DepositCard';
import { WithdrawCard } from '@/components/WithdrawCard';
import { MintNFTCard } from '@/components/MintNFTCard';
import { AnimatedCard } from '@/components/AnimatedCard';
import { useAccount, useBalance } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <main className="min-h-screen p-4 pb-20">
      {/* Navbar */}
      <nav className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          ⚡ Base Mini App
        </h1>
        <WalletButton />
      </nav>

      {/* Wallet Status */}
      {isConnected && address && (
        <AnimatedCard className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Connected</p>
              <p className="font-mono text-neon-blue">{address.slice(0, 6)}...{address.slice(-4)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-xl font-bold text-neon-cyan">
                {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
              </p>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Dashboard Cards */}
      <div className="grid gap-4 max-w-md mx-auto">
        <DepositCard />
        <WithdrawCard />
        <MintNFTCard />
      </div>
    </main>
  );
}
