import { Forbidden } from '../../../../packages/ui/components/feedbacks';
import PermissionGuard, { PermissionGuardProps } from '../permission-guard';

const PagePermissionGuard = ({ children, ...rest }: PermissionGuardProps) => {
  return (
    <PermissionGuard fallback={<Forbidden />} {...rest}>
      {children}
    </PermissionGuard>
  );
};

export default PagePermissionGuard;
