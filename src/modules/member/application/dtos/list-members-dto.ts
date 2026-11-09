export interface ListMembersDto {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  roleId?: string;
  includeDeleted?: boolean;
}
