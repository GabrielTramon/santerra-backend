import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import {
  PRODUCER_REPOSITORY,
  ProducerRepository,
} from "../../domain/repositories/producer-repository";

@injectable()
export class DeleteProducerUseCase {
  constructor(
    @inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: ProducerRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<void> {
    const producer = await this.producerRepository.findById(id, context.companyId);

    if (!producer) {
      throw new ResourceNotFoundError("Produtor não encontrado.");
    }

    producer.delete(context.userId);
    await this.producerRepository.delete(producer);
  }
}
