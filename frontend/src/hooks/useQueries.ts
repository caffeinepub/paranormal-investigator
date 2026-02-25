import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserCases(caseId?: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['userCases', caseId],
    queryFn: async () => {
      if (!actor) return [];
      if (!identity) return [];
      const cases = await actor.getAllCases();
      if (caseId) {
        return cases.filter(c => c.id === caseId);
      }
      return cases;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetUserCaseById(caseId: string, isAuthenticated: boolean) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userCase', caseId],
    queryFn: async () => {
      if (!actor) return null;
      const cases = await actor.getAllCases();
      return cases.find(c => c.id === caseId) || null;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useSubmitCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      location: string;
      phenomenaType: string;
      description: string;
      contactInfo: string;
      photo: any | null;
      ownerEmail: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitCase(
        params.location,
        params.phenomenaType,
        params.description,
        params.contactInfo,
        params.photo,
        params.ownerEmail
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCases'] });
      queryClient.invalidateQueries({ queryKey: ['allCases'] });
    },
  });
}

export function useUpdateCaseStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId }: { caseId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markCaseResolved(caseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCases'] });
      queryClient.invalidateQueries({ queryKey: ['allCases'] });
    },
  });
}
