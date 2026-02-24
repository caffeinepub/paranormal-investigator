import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PhenomenaType, InvestigationStatus, type ParanormalCase, ExternalBlob } from '@/backend';

export function useGetAllCases() {
  const { actor, isFetching } = useActor();

  return useQuery<ParanormalCase[]>({
    queryKey: ['cases'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFilterCasesByType(phenomenaType: PhenomenaType) {
  const { actor, isFetching } = useActor();

  return useQuery<ParanormalCase[]>({
    queryKey: ['cases', 'type', phenomenaType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterCasesByType(phenomenaType);
    },
    enabled: !!actor && !isFetching && !!phenomenaType,
  });
}

export function useFilterCasesByLocation(location: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ParanormalCase[]>({
    queryKey: ['cases', 'location', location],
    queryFn: async () => {
      if (!actor || !location) return [];
      return actor.filterCasesByLocation(location);
    },
    enabled: !!actor && !isFetching && !!location,
  });
}

export function useGetCaseById(caseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ParanormalCase | null>({
    queryKey: ['case', caseId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCaseById(caseId);
    },
    enabled: !!actor && !isFetching && !!caseId,
  });
}

export function useSubmitCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      location,
      phenomenaType,
      description,
      contactInfo,
      photo,
    }: {
      location: string;
      phenomenaType: PhenomenaType;
      description: string;
      contactInfo: string;
      photo: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitCase(location, phenomenaType, description, contactInfo, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}

export function useUpdateCaseStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caseId,
      newStatus,
    }: {
      caseId: string;
      newStatus: InvestigationStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateCaseStatus(caseId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['case'] });
    },
  });
}
