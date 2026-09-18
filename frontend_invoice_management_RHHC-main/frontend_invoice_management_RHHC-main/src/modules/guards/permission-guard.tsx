// @ts-expect-error - temporary fix

/* eslint-disable */
import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';
// import BaseAuthGuard, {
//   GuardProps,
// } from '~/modules/auth/guards/base-auth-guard';
// import { Permission } from '~/modules/auth/types/enum';
import { Permission, permissionsType } from '../auth/types/enum';
import PageLoader from '../common/elements/page/page-loader';
import BaseAuthGuard, { GuardProps } from './base-auth-guard';
// import useAuth from '../hooks/useAuth';

type GuardMode = 'any' | 'all';

export interface PermissionGuardProps extends GuardProps {
  /**
   * Permissions for which component should be displayed to the user.
   *
   * You need to pass the permission as [module:kind]
   * @example
   * `"vendor:write"`
   * */
  permissions?: Permission | Permission[];

  /** Permissions for which component **should not** be displayed to the user */
  except?: Permission | Permission[];

  /** If provided `permissions` is an array. Do we need to check if user has "all" the permissions or "any" permission provided in the array. Defaults to "any" */
  mode?: GuardMode;
}

const PermissionGuard = ({
  permissions,
  except,
  children,
  fallback,
  mode = 'any',
}: PermissionGuardProps) => {
  const { user, isAuthLoading } = useAuth();
  const parsedPermission = user ? JSON.parse(user.menu_map || '{}') : '';
  const userPermissions = useMemo(() => {
    return user ? getTransformedPermissions(parsedPermission) : [];
  }, [parsedPermission]);

  const canRender = useMemo(() => {
    if (permissions) {
      /** We need to check if user have the provided `permissions` */
      const permissionsToAllow =
        typeof permissions === 'string' ? [permissions] : permissions;

      if (mode === 'all') {
        return permissionsToAllow.every((permissionToAllow) =>
          userPermissions.includes(permissionToAllow),
        );
      }
      return permissionsToAllow.some((permissionToAllow) =>
        userPermissions.includes(permissionToAllow),
      );
    }

    if (except) {
      /** We need to check if user does not have the provided permissions (passed as `except`) */
      const permissionsToForbid =
        typeof except === 'string' ? [except] : except;

      if (mode === 'all') {
        return !permissionsToForbid.every((permissionToForbid) =>
          userPermissions.includes(permissionToForbid),
        );
      }

      return !permissionsToForbid.some((permissionToForbid) =>
        userPermissions.includes(permissionToForbid),
      );
    }

    return false;
  }, [userPermissions, permissions, except, mode]);

  return !isAuthLoading ? (
    <BaseAuthGuard condition={canRender} fallback={fallback}>
      {children}
    </BaseAuthGuard>
  ) : (
    <PageLoader />
  );
};

const getPermissionKind = (short: string) => {
  if (short === 'w') {
    return 'write';
  } else if (short === 'r') {
    return 'read';
  } else if (short === 'd') {
    return 'delete';
  }
};

/**
 * Transforms all the user permissions to the "module:kind" format
 *
 * If user have the following permissions,
 * ```(json)
 *  {
 *    "vendor": "rw",
 *    "product": "r"
 *  }
 * ```
 *
 * We would convert them to `["vendor:write", "vendor:read", "product:read"]`
 **/
export const getTransformedPermissions = (
  permissions: permissionsType,
): string[] => {
  const transformed: string[] = [];

  for (const [module, permissionKindList] of Object.entries(
    permissions || {},
  )) {
    if (!permissionKindList) {
      continue;
    }

    transformed.push(
      ...permissionKindList
        .split('')
        .map((kind) => `${module}:${getPermissionKind(kind)}`),
    );
  }

  return transformed;
};

export default PermissionGuard;
