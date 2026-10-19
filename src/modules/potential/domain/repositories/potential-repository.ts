import { Potential } from "../entities/potential";

export const POTENTIAL_REPOSITORY = "PotentialRepository";

export interface FindPotentialsParams {
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
  findById(id: string, includeDeleted?: boolean): Promise<Potential | null>;
  findMany(params: FindPotentialsParams): Promise<FindPotentialsResult>;
  update(potential: Potential): Promise<Potential>;
  delete(potential: Potential): Promise<void>;
}
