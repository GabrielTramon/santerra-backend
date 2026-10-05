export interface ListProductsDto {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}
