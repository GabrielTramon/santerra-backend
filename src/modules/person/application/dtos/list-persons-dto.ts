export interface ListPersonsDto {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}
