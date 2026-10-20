import { Producer } from "../entities/producer";

export const PRODUCER_REPOSITORY = "ProducerRepository";

export interface FindProducersParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  potentialId?: string;
  includeDeleted: boolean;
}

export interface FindProducersResult {
  producers: Producer[];
  total: number;
}

export interface ProducerRepository {
  create(producer: Producer): Promise<Producer>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Producer | null>;
  findByPersonId(personId: string, companyId: string): Promise<Producer | null>;
  findMany(params: FindProducersParams): Promise<FindProducersResult>;
  update(producer: Producer): Promise<Producer>;
  delete(producer: Producer): Promise<void>;
}
