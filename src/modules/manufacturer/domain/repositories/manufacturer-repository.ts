import { Manufacturer } from "../entities/manufacturer";

export const MANUFACTURER_REPOSITORY = "ManufacturerRepository";

export interface FindManufacturersParams {
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindManufacturersResult {
  manufacturers: Manufacturer[];
  total: number;
}


export interface ManufacturerRepository {
  create(manufacturer: Manufacturer): Promise<Manufacturer>;
  findById(id: string, includeDeleted?: boolean): Promise<Manufacturer | null>;
  findMany(params: FindManufacturersParams): Promise<FindManufacturersResult>;
  update(manufacturer: Manufacturer): Promise<Manufacturer>;
  delete(manufacturer: Manufacturer): Promise<void>;
}
