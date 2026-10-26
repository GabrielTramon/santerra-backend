import { Event } from "../entities/event";

export const EVENT_REPOSITORY = "EventRepository";

export interface FindEventsParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindEventsResult {
  events: Event[];
  total: number;
}

export interface EventRepository {
  create(event: Event): Promise<Event>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Event | null>;
  findMany(params: FindEventsParams): Promise<FindEventsResult>;
  update(event: Event): Promise<Event>;
  delete(event: Event): Promise<void>;
}
