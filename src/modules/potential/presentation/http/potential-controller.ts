import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { idParamSchema, listQuerySchema } from "../../../../shared/http/request-schemas";
import { CreatePotentialUseCase } from "../../application/use-cases/create-potential-use-case";
import { DeletePotentialUseCase } from "../../application/use-cases/delete-potential-use-case";
import { GetPotentialUseCase } from "../../application/use-cases/get-potential-use-case";
import { ListPotentialsUseCase } from "../../application/use-cases/list-potentials-use-case";
import { UpdatePotentialUseCase } from "../../application/use-cases/update-potential-use-case";
import { createPotentialSchema, updatePotentialSchema } from "./potential-schemas";

@injectable()
export class PotentialController {
  constructor(
    private readonly createPotentialUseCase: CreatePotentialUseCase,
    private readonly listPotentialsUseCase: ListPotentialsUseCase,
    private readonly getPotentialUseCase: GetPotentialUseCase,
    private readonly updatePotentialUseCase: UpdatePotentialUseCase,
    private readonly deletePotentialUseCase: DeletePotentialUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const product = await this.createPotentialUseCase.execute(
      createPotentialSchema.parse(request.body),
    );

    response.status(201).json(product);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listPotentialsUseCase.execute(
      listQuerySchema.parse(request.query),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const product = await this.getPotentialUseCase.execute(id);

    response.status(200).json(product);
  };

  update: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const product = await this.updatePotentialUseCase.execute(
      id,
      updatePotentialSchema.parse(request.body),
    );

    response.status(200).json(product);
  };

  delete: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await this.deletePotentialUseCase.execute(id);

    response.status(204).send();
  };
}
