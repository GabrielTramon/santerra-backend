import { Role } from "../entities/role";

export const ROLE_REPOSITORY = "RoleRepository";

export interface FindRolesParams {
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindRolesResult {
  roles: Role[];
  total: number;
}

export interface RoleRepository {
  create(role: Role): Promise<Role>;
  findById(id: string, includeDeleted?: boolean): Promise<Role | null>;
  findMany(params: FindRolesParams): Promise<FindRolesResult>;
  update(role: Role): Promise<Role>;
  delete(role: Role): Promise<void>;
}
