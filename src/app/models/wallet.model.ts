export interface WalletTransaction {
  id: string;
  type: 'sale' | 'withdrawal' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Wallet {
  balance: number;
  currency: string;
  pendingWithdrawals: number;
  availableForWithdrawal: number;
  transactions: WalletTransaction[];
}
