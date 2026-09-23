import { Company } from "../entities/company";

export interface FindCompaniesParams {
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindCompaniesResult {
  companies: Company[];
  total: number;
}

export interface CompanyRepository {
  create(company: Company): Promise<Company>;
  findById(id: string, includeDeleted?: boolean): Promise<Company | null>;
  findMany(params: FindCompaniesParams): Promise<FindCompaniesResult>;
  save(company: Company): Promise<Company>;
}
