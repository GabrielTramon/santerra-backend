export interface ListEmployeesDto {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}
