export interface ListMembersDto {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}
