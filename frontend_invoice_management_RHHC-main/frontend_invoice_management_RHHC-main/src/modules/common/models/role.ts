import { BaseDocument } from './baseDocument';

export interface Role extends BaseDocument {
  id: string;
  name: string;
  alias: string;
  menu_map: string;
  account_id: number;
  branch_id: number;
  is_default: number;
}

export type PermissionModule = string;

export type PermissionKind = 'r' | 'rw' | 'rwd';

export type RolePermissionMap = Record<PermissionModule, PermissionKind>;

export interface RoleWithPermission extends Role {
  permissionMap: RolePermissionMap;

  isActive: boolean;
}
