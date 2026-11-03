import { Potential } from "../entities/potential";

export const POTENTIAL_REPOSITORY = "PotentialRepository";

export interface FindPotentialsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindPotentialsResult {
  potentials: Potential[];
  total: number;
}

export interface PotentialRepository {
  create(potential: Potential): Promise<Potential>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Potential | null>;
  findByName(name: string, companyId: string): Promise<Potential | null>;
  findMany(params: FindPotentialsParams): Promise<FindPotentialsResult>;
  update(potential: Potential): Promise<Potential>;
  delete(potential: Potential): Promise<void>;
}
