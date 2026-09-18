import { Forbidden } from 'ui/components/feedbacks';
import RoleGuard, { RoleGuardProps } from '~/modules/auth/guards/role-guard';

const PageRoleGuard = ({ children, ...rest }: RoleGuardProps) => {
  return (
    <RoleGuard fallback={<Forbidden />} {...rest}>
      {children}
    </RoleGuard>
  );
};

export default PageRoleGuard;
