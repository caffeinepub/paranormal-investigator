import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Investigation, TeamMember, Testimonial } from '../backend';

// ── Investigations ──────────────────────────────────────────────────────────

export function useInvestigations() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Investigation & { id: string }>>({
    queryKey: ['investigations'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllInvestigationCases();
      return items.map((item, i) => ({ ...item, id: String(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateInvestigation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, investigation }: { id: string; investigation: Investigation }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createInvestigation(id, investigation);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['investigations'] }),
  });
}

export function useUpdateInvestigation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, investigation }: { id: string; investigation: Investigation }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInvestigation(id, investigation);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['investigations'] }),
  });
}

export function useDeleteInvestigation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteInvestigation(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['investigations'] }),
  });
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export function useTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<Testimonial & { id: string }>>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllTestimonials();
      return items.map((item, i) => ({ ...item, id: String(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, testimonial }: { id: string; testimonial: Testimonial }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createTestimonial(id, testimonial);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, testimonial }: { id: string; testimonial: Testimonial }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateTestimonial(id, testimonial);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTestimonial(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

// ── Team Members ─────────────────────────────────────────────────────────────

export function useTeamMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<TeamMember & { id: string }>>({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      if (!actor) return [];
      const items = await actor.getAllTeamMembers();
      return items.map((item, i) => ({ ...item, id: String(i) }));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTeamMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, member }: { id: string; member: TeamMember }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createTeamMember(id, member);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teamMembers'] }),
  });
}

export function useUpdateTeamMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, member }: { id: string; member: TeamMember }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateTeamMember(id, member);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teamMembers'] }),
  });
}

export function useDeleteTeamMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTeamMember(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teamMembers'] }),
  });
}

// ── Analytics ─────────────────────────────────────────────────────────────────
// Analytics tracking is handled client-side via localStorage since the backend
// no longer exposes analytics endpoints.

const ANALYTICS_KEY = 'opi_analytics';

interface AnalyticsStore {
  pageVisits: Record<string, number>;
  submissions: Record<string, number>;
}

function getAnalyticsStore(): AnalyticsStore {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { pageVisits: {}, submissions: {} };
}

function saveAnalyticsStore(store: AnalyticsStore) {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function recordPageVisitLocal(pageName: string) {
  const store = getAnalyticsStore();
  store.pageVisits[pageName] = (store.pageVisits[pageName] ?? 0) + 1;
  saveAnalyticsStore(store);
}

export function recordFormSubmissionLocal(formType: string) {
  const store = getAnalyticsStore();
  store.submissions[formType] = (store.submissions[formType] ?? 0) + 1;
  saveAnalyticsStore(store);
}

export function useAnalyticsData() {
  return useQuery<{ pageVisits: Array<[string, number]>; submissions: Array<[string, number]> }>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const store = getAnalyticsStore();
      return {
        pageVisits: Object.entries(store.pageVisits),
        submissions: Object.entries(store.submissions),
      };
    },
  });
}
