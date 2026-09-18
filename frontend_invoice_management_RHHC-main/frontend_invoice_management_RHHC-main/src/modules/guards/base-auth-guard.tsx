import { ReactNode } from 'react';

export interface GuardProps {
  children: ReactNode;

  /** Optional fallback component which should be displayed when condition is not satisfied */
  fallback?: ReactNode;
}

interface BaseGuardProps extends GuardProps {
  condition: boolean;
}

const BaseAuthGuard = ({ condition, children, fallback }: BaseGuardProps) => {
  if (!condition) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default BaseAuthGuard;
