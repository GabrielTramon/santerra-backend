import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { Event, EventProps } from "../../domain/entities/event";
import {
  EVENT_REPOSITORY,
  EventRepository,
} from "../../domain/repositories/event-repository";
import { CreateEventDto } from "../dtos/create-event-dto";

@injectable()
export class CreateEventUseCase {
  constructor(
    @inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(
    input: CreateEventDto,
    context: TenantContext,
  ): Promise<EventProps> {
    const event = Event.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdEvent = await this.eventRepository.create(event);

    return createdEvent.toObject();
  }
}
