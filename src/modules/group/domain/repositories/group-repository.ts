import { Group } from "../entities/group";

export const GROUP_REPOSITORY = "GroupRepository";

export interface FindGroupsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindGroupsResult {
  groups: Group[];
  total: number;
}

export interface GroupRepository {
  create(group: Group): Promise<Group>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Group | null>;
  findMany(params: FindGroupsParams): Promise<FindGroupsResult>;
  update(group: Group): Promise<Group>;
  delete(group: Group): Promise<void>;
}
