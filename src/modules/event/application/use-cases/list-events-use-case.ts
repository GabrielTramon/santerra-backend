import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { PaginatedDto } from "../../../../shared/dtos/paginated-dto";
import { EventProps } from "../../domain/entities/event";
import {
  EVENT_REPOSITORY,
  EventRepository,
} from "../../domain/repositories/event-repository";
import { ListEventsDto } from "../dtos/list-events-dto";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

@injectable()
export class ListEventsUseCase {
  constructor(
    @inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(
    input: ListEventsDto,
    context: TenantContext,
  ): Promise<PaginatedDto<EventProps>> {
    const page = input.page ?? DEFAULT_PAGE;
    const limit = input.limit ?? DEFAULT_LIMIT;

    const search = input.search?.trim() || undefined;
    const result = await this.eventRepository.findMany({
      companyId: context.companyId,
      page,
      limit,
      search,
      includeDeleted: input.includeDeleted ?? false,
    });

    return {
      data: result.events.map((event) => event.toObject()),
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }
}
