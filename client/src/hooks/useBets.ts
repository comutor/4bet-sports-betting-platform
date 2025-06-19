import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface BetData {
  betType: 'single' | 'accumulator';
  selections: Array<{
    eventName: string;
    selection: string;
    odds: string;
  }>;
  totalStake: string;
  potentialReturn: string;
  currency: string;
}

export interface UserBet {
  id: number;
  userId: number;
  betType: string;
  selections: string;
  totalStake: string;
  potentialReturn: string;
  actualReturn: string | null;
  currency: string;
  status: string;
  placedAt: Date | null;
  settledAt: Date | null;
}

export function useBets(status?: string) {
  return useQuery({
    queryKey: ['/api/user/bets', status],
    enabled: true,
  });
}

export function usePlaceBet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (betData: BetData) => {
      return await apiRequest('/api/user/bets/place', 'POST', betData);
    },
    onSuccess: () => {
      // Invalidate and refetch user bets and balance
      queryClient.invalidateQueries({ queryKey: ['/api/user/bets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });
}

export function useBalance() {
  return useQuery({
    queryKey: ['/api/user/balance'],
    enabled: true,
  });
}

export function useUpdateBalance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ amount, type, description }: { 
      amount: string; 
      type: string; 
      description?: string; 
    }) => {
      return await apiRequest('/api/user/balance/update', 'POST', { amount, type, description });
    },
    onSuccess: () => {
      // Invalidate and refetch balance and user data
      queryClient.invalidateQueries({ queryKey: ['/api/user/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });
}

export function useTransactions(limit?: number) {
  return useQuery({
    queryKey: ['/api/user/transactions', limit],
    enabled: true,
  });
}