import useAuth from '../hooks/useAuth';
import useOrganisation from '../hooks/useOrganisation';
import { getTransformedPermissions } from './permission-guard';

const useCheckModulePermission = (
  permissions: string | string[],
  mode: 'any' | 'all' = 'any',
) => {
  const organisation = useOrganisation();
  const { user } = useAuth();

  // Compute user permissions directly
  const userPermissions = organisation
    ? getTransformedPermissions(organisation.permissions)
    : [];

  // Compute `canRender`
  const currentOrg = user?.organisations.find(
    (org) => org.id === organisation?.id,
  );

  if (currentOrg?.admin) {
    return true;
  }

  if (permissions) {
    const permissionsToAllow =
      typeof permissions === 'string' ? [permissions] : permissions;

    if (mode === 'all') {
      return permissionsToAllow.every((permission) =>
        userPermissions.includes(permission),
      );
    }
    return permissionsToAllow.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  return false;
};

export default useCheckModulePermission;
