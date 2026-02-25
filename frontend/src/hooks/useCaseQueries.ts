import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CaseLookupResult } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useGetAllCases() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['allCases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCases();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetMyCases(email: string | undefined) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CaseLookupResult>({
    queryKey: ['myCases', email],
    queryFn: async () => {
      if (!actor || !email) return { hasCase: false, caseSummaries: [] };
      return actor.getCasesForUser(email);
    },
    enabled: !!actor && !isFetching && !!identity && !!email,
    retry: false,
  });
}

export function useMarkCaseResolved() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markCaseResolved(caseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCases'] });
      queryClient.invalidateQueries({ queryKey: ['myCases'] });
    },
  });
}

export function useDeleteCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCase(caseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCases'] });
    },
  });
}
