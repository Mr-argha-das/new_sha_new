export type Role = string;

export type Permission = string;

export type PermissionModule = string;

export type PermissionKind = 'r' | 'rw' | 'rwd';

export type permissionsType = Record<PermissionModule, PermissionKind>;
