export const PERMISSIONS = {
  COMPANY_UPDATE: "company.update",

  PERSONS_READ: "persons.read",
  PERSONS_CREATE: "persons.create",
  PERSONS_UPDATE: "persons.update",
  PERSONS_DELETE: "persons.delete",

  PRODUCTS_READ: "products.read",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",

  ROLES_READ: "roles.read",
  ROLES_CREATE: "roles.create",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",

  MEMBERS_READ: "members.read",
  MEMBERS_UPDATE: "members.update",
  MEMBERS_DELETE: "members.delete",

  INVITATIONS_READ: "invitations.read",
  INVITATIONS_CREATE: "invitations.create",
  INVITATIONS_DELETE: "invitations.delete",

  WALLETS_READ: "wallets.read",
  WALLETS_CREATE: "wallets.create",
  WALLETS_UPDATE: "wallets.update",
  WALLETS_DELETE: "wallets.delete",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: PermissionName[] = Object.values(PERMISSIONS);
