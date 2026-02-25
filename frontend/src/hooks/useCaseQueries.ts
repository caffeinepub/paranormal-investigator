import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CaseLookupResult } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';
import { useAdminContext } from '../contexts/AdminContext';

/**
 * Calls initAdmin() on the backend to register the current Internet Identity
 * principal as admin (only succeeds if no admin is registered yet, or returns
 * false if one already exists). Must be called before any admin-gated queries.
 */
export function useInitAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['initAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Returns true if this caller became admin, false if already registered
      return actor.initAdmin();
    },
    // Only run when we have an authenticated II identity and the actor is ready
    enabled: !!actor && !isFetching && !!identity,
    // Don't retry on failure — if it fails, show the error
    retry: false,
    // Cache the result — no need to re-run on every render
    staleTime: Infinity,
  });
}

export function useGetAllCases() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { isAdmin: isPinAdmin } = useAdminContext();

  // Run initAdmin first when using Internet Identity
  const { isFetched: adminInitFetched, isError: adminInitError } = useInitAdmin();

  return useQuery({
    queryKey: ['allCases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCases();
    },
    // For II users: wait for initAdmin to complete (success or failure — backend
    // auto-assigns on first call, so even "false" means admin is already set).
    // For PIN-only admins: allow fetching directly.
    enabled: !!actor && !isFetching && (
      isPinAdmin
        ? true
        : (!!identity && adminInitFetched)
    ),
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
  const { adminEmail } = useAdminContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend requires (caseId, adminEmail) — use stored admin email or fallback
      const email = adminEmail ?? 'admin@okpi.local';
      return actor.markCaseResolved(caseId, email);
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
