import type { ReactNode, FC } from 'react';
import type { UserRole } from '@shared/types';
import Unauthorized from '../../unauthorized/unauthorized';
import { useFetchUser } from '../../../utils/hooks/auth/useFetchUser';

interface ProjectLeadAuthGuardProps {
  children: ReactNode;
}

/**
 * Fetches the current authenticated user from the backend.
 */

export const ProjectLeadAuthGuard: FC<ProjectLeadAuthGuardProps> = ({ children }) => {
  const { user } = useFetchUser();

  if (!user || (user.role as UserRole) !== 'PROJECT_LEAD') {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

interface LocalLeaderAuthGuardProps {
  children: ReactNode;
}

export const LocalLeaderAuthGuard: FC<LocalLeaderAuthGuardProps> = ({ children }) => {
  const { user } = useFetchUser();

  if (!user || (user.role as UserRole) !== 'LOCAL_LEADER') {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

interface AdminAuthGuardProps {
  children: ReactNode;
}

export const AdminAuthGuard: FC<AdminAuthGuardProps> = ({ children }) => {
  const { user } = useFetchUser();

  if (!user || !['PROJECT_LEAD', 'LOCAL_LEADER'].includes(user.role as UserRole)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};
