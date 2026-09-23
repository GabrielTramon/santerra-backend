import { CompanyProps } from "../../domain/entities/company";

export interface CreateCompanyInput {
  name: string;
  description?: string | null;
  logo?: string | null;
  createdById?: string | null;
}

export interface UpdateCompanyInput {
  id: string;
  name?: string;
  description?: string | null;
  logo?: string | null;
  updatedById?: string | null;
}

export interface DeleteCompanyInput {
  id: string;
  deletedById?: string | null;
}

export interface ListCompaniesInput {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}

export interface PaginatedCompaniesOutput {
  data: CompanyProps[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
