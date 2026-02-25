import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Re-export admin queries for convenience
export * from './useAdminQueries';

// Public queries
export function useGetAllInvestigations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['investigations-public'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvestigations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTeamMembers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['teamMembers-public'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}
