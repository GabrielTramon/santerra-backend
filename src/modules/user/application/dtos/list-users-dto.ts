export interface ListUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}
