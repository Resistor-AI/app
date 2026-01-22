// queries/useBalance.ts
import { getUserBalance } from "@/services/walletService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export function useBalance(address?: string) {
  return useQuery({
    queryKey: address ? queryKeys.balance(address) : [],
    queryFn: () => getUserBalance(address!),
    enabled: !!address,
    refetchInterval: 30_000, // auto refresh balance
  });
}
