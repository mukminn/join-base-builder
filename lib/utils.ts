import { type ClassValue, clsx } from 'clsx';
import { formatEther, parseEther } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatETH(value: bigint | string): string {
  try {
    const num = typeof value === 'string' ? BigInt(value) : value;
    return formatEther(num);
  } catch {
    return '0';
  }
}

export function parseETH(value: string): bigint {
  try {
    return parseEther(value);
  } catch {
    return 0n;
  }
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number | string, decimals: number = 4): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return n.toFixed(decimals).replace(/\.?0+$/, '');
}
