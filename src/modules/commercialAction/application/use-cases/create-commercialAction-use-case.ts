import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { CommercialAction, CommercialActionProps } from "../../domain/entities/commercialAction";
import {
  COMMERCIAL_ACTION_REPOSITORY,
  CommercialActionRepository,
} from "../../domain/repositories/commercialAction-repository";
import { CreateCommercialActionDto } from "../dtos/create-commercialAction-dto";

@injectable()
export class CreateCommercialActionUseCase {
  constructor(
    @inject(COMMERCIAL_ACTION_REPOSITORY)
    private readonly commercialActionRepository: CommercialActionRepository,
  ) {}

  async execute(
    input: CreateCommercialActionDto,
    context: TenantContext,
  ): Promise<CommercialActionProps> {
    const commercialAction = CommercialAction.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });
    const createdCommercialAction = await this.commercialActionRepository.create(commercialAction);

    return createdCommercialAction.toObject();
  }
}
