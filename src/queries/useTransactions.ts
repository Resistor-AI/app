// queries/useTransactions.ts
import { getTransactions } from "@/services/walletService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export function useTransactions(address?: string) {
  return useQuery({
    queryKey: address ? queryKeys.transactions(address) : [],
    queryFn: () => getTransactions(address),
    enabled: !!address,
    staleTime: 10_000,
  });
}
