import { useCallback } from 'react';
import { useActor } from './useActor';

export function useAnalytics() {
  const { actor } = useActor();

  const trackPageVisit = useCallback(
    (pageName: string) => {
      if (!actor) return;
      actor.recordPageVisit(pageName).catch(() => {
        // fire-and-forget, ignore errors
      });
    },
    [actor]
  );

  const trackFormSubmission = useCallback(
    (formType: string) => {
      if (!actor) return;
      actor.recordFormSubmission(formType).catch(() => {
        // fire-and-forget, ignore errors
      });
    },
    [actor]
  );

  return { trackPageVisit, trackFormSubmission };
}
