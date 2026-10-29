import "./commercialTrip-container";

export { CommercialTrip } from "./domain/entities/commercialAction";
export { COMMERCIAL_TRIP_REPOSITORY } from "./domain/repositories/commercialAction-repository";
export type { CommercialTripRepository } from "./domain/repositories/commercialAction-repository";
export { commercialTripRouter } from "./presentation/http/commercialTrip-routes";
