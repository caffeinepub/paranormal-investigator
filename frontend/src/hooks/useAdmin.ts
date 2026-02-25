import { useAdminContext } from '../contexts/AdminContext';

/**
 * Convenience hook that exposes the AdminContext consumer.
 * Returns isAdmin, adminEmail, login, and logout from the AdminContext.
 * Used for PIN-based admin authentication (client-side only, no backend calls).
 */
export function useAdmin() {
  return useAdminContext();
}
