import { useCallback } from 'react';
import { recordPageVisitLocal, recordFormSubmissionLocal } from './useAdminQueries';

export function useAnalytics() {
  const trackPageVisit = useCallback((pageName: string) => {
    recordPageVisitLocal(pageName);
  }, []);

  const trackFormSubmission = useCallback((formType: string) => {
    recordFormSubmissionLocal(formType);
  }, []);

  return { trackPageVisit, trackFormSubmission };
}
