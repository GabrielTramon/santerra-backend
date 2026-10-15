import { Person } from "../entities/person";

export const PERSON_REPOSITORY = "PersonRepository";

export interface FindPersonsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindPersonsResult {
  persons: Person[];
  total: number;
}

export interface PersonRepository {
  create(person: Person): Promise<Person>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Person | null>;
  findByNationalId(nationalId: string, companyId: string): Promise<Person | null>;
  findMany(params: FindPersonsParams): Promise<FindPersonsResult>;
  update(person: Person): Promise<Person>;
  delete(person: Person): Promise<void>;
}
