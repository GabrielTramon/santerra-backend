import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { ProducerProps } from "../../domain/entities/producer";
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from "../../domain/repositories/producer-repository";

@injectable()
export class GetProducerUseCase {
  constructor(
    @inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<ProducerProps> {
    const producer = await this.producerRepository.findById(id, context.companyId);

    if (!producer) {
      throw new ResourceNotFoundError("Produtor não encontrado.");
    }

    return producer.toObject();
  }
}
