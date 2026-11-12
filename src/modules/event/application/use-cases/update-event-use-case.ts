import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { EventProps } from "../../domain/entities/event";
import {
  EVENT_REPOSITORY,
  EventRepository,
} from "../../domain/repositories/event-repository";
import { UpdateEventDto } from "../dtos/update-event-dto";

@injectable()
export class UpdateEventUseCase {
  constructor(
    @inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateEventDto,
    context: TenantContext,
  ): Promise<EventProps> {
    const event = await this.eventRepository.findById(id, context.companyId);

    if (!event) {
      throw new ResourceNotFoundError("Evento não encontrado.");
    }

    event.update({ ...input, updatedById: context.userId });
    const updatedEvent = await this.eventRepository.update(event);

    return updatedEvent.toObject();
  }
}
