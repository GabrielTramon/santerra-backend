export interface ListWalletsDto {
  page?: number;
  limit?: number;
  search?: string;
  userCompanyId?: string;
  includeDeleted?: boolean;
}
