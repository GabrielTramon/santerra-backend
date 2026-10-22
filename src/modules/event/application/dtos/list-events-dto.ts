export interface ListEventsDto {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}
