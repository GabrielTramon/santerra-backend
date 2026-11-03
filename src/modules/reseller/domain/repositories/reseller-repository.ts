import { Reseller } from "../entities/reseller";

export const RESELLER_REPOSITORY = "ResellerRepository";

export interface FindResellersParams {
  companyId: string;
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
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Reseller | null>;
  findByRegistrationNumber(
    registrationNumber: string,
    companyId: string,
  ): Promise<Reseller | null>;
  findManyByIds(ids: string[], companyId: string): Promise<Reseller[]>;
  findMany(params: FindResellersParams): Promise<FindResellersResult>;
  update(reseller: Reseller): Promise<Reseller>;
  delete(reseller: Reseller): Promise<void>;
}
