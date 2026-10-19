import { Reseller } from "../entities/reseller";

export const RESELLER_REPOSITORY = "ResellerRepository";

export interface FindResellersParams {
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}


export interface FindResellersResult {
  resellers: Reseller[];
  total: number;
}


export interface ResellerRepository {
  create(reseller: Reseller): Promise<Reseller>;
  findById(id: string, includeDeleted?: boolean): Promise<Reseller | null>;
  findMany(params: FindResellersParams): Promise<FindResellersResult>;
  update(reseller: Reseller): Promise<Reseller>;
  delete(reseller: Reseller): Promise<void>;
}
