import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { CommercialActionProps } from "../../domain/entities/commercialAction";
import {
  COMMERCIAL_ACTION_REPOSITORY,
  CommercialActionRepository,
} from "../../domain/repositories/commercialAction-repository";
import { UpdateCommercialActionDto } from "../dtos/update-commercialAction-dto";

@injectable()
export class UpdateCommercialActionUseCase {
  constructor(
    @inject(COMMERCIAL_ACTION_REPOSITORY)
    private readonly commercialActionRepository: CommercialActionRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCommercialActionDto,
    context: TenantContext,
  ): Promise<CommercialActionProps> {
    const commercialAction = await this.commercialActionRepository.findById(id, context.companyId);

    if (!commercialAction) {
      throw new ResourceNotFoundError("Ação comercial não encontrada.");
    }

    commercialAction.update({ ...input, updatedById: context.userId });
    const updatedCommercialAction = await this.commercialActionRepository.update(commercialAction);

    return updatedCommercialAction.toObject();
  }
}
