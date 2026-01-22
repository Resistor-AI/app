export const queryKeys = {
  balance: (address: string) => ["balance", address] as const,
  transactions: (address: string) => ["transactions", address] as const,
};
