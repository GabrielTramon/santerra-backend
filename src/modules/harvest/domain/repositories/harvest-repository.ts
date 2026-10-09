import { Harvest } from "../entities/harvest";

export const HARVEST_REPOSITORY = "HarvestRepository";

export interface FindHarvestsParams {
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindHarvestsResult {
  harvests: Harvest[];
  total: number;
}

export interface HarvestRepository {
  create(harvest: Harvest): Promise<Harvest>;
  findById(id: string, includeDeleted?: boolean): Promise<Harvest | null>;
  findMany(params: FindHarvestsParams): Promise<FindHarvestsResult>;
  update(harvest: Harvest): Promise<Harvest>;
  delete(harvest: Harvest): Promise<void>;
}
