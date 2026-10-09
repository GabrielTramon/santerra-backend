import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { idParamSchema, listQuerySchema } from "../../../../shared/http/request-schemas";
import { CreateHarvestUseCase } from "../../application/use-cases/create-harvest-use-case";
import { DeleteHarvestUseCase } from "../../application/use-cases/delete-harvest-use-case";
import { GetHarvestUseCase } from "../../application/use-cases/get-harvest-use-case";
import { ListHarvestsUseCase } from "../../application/use-cases/list-harvests-use-case";
import { UpdateHarvestUseCase } from "../../application/use-cases/update-harvest-use-case";
import { createHarvestSchema, updateHarvestSchema } from "./harvest-schemas";

@injectable()
export class HarvestController {
  constructor(
    private readonly createHarvestUseCase: CreateHarvestUseCase,
    private readonly listHarvestsUseCase: ListHarvestsUseCase,
    private readonly getHarvestUseCase: GetHarvestUseCase,
    private readonly updateHarvestUseCase: UpdateHarvestUseCase,
    private readonly deleteHarvestUseCase: DeleteHarvestUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const harvest = await this.createHarvestUseCase.execute(
      createHarvestSchema.parse(request.body),
    );

    response.status(201).json(harvest);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listHarvestsUseCase.execute(
      listQuerySchema.parse(request.query),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const harvest = await this.getHarvestUseCase.execute(id);

    response.status(200).json(harvest);
  };

  update: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const harvest = await this.updateHarvestUseCase.execute(
      id,
      updateHarvestSchema.parse(request.body),
    );

    response.status(200).json(harvest);
  };

  delete: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await this.deleteHarvestUseCase.execute(id);

    response.status(204).send();
  };
}
