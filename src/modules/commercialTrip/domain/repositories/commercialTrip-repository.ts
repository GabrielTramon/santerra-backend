import { CommercialTrip } from "../entities/commercialTrip";

export const COMMERCIAL_TRIP_REPOSITORY = "CommercialTripRepository";

export interface FindCommercialTripsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindCommercialTripsResult {
  commercialTrips: CommercialTrip[];
  total: number;
}

export interface CommercialTripRepository {
  create(commercialTrip: CommercialTrip): Promise<CommercialTrip>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<CommercialTrip | null>;
  findMany(params: FindCommercialTripsParams): Promise<FindCommercialTripsResult>;
  update(commercialTrip: CommercialTrip): Promise<CommercialTrip>;
  delete(commercialTrip: CommercialTrip): Promise<void>;
}
