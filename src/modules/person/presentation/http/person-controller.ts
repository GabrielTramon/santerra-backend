import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { idParamSchema, listQuerySchema } from "../../../../shared/http/request-schemas";
import { CreatePersonUseCase } from "../../application/use-cases/create-person-use-case";
import { DeletePersonUseCase } from "../../application/use-cases/delete-person-use-case";
import { GetPersonUseCase } from "../../application/use-cases/get-person-use-case";
import { ListPersonsUseCase } from "../../application/use-cases/list-persons-use-case";
import { UpdatePersonUseCase } from "../../application/use-cases/update-person-use-case";
import { createPersonSchema, updatePersonSchema } from "./person-schemas";

@injectable()
export class PersonController {
  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly listPersonsUseCase: ListPersonsUseCase,
    private readonly getPersonUseCase: GetPersonUseCase,
    private readonly updatePersonUseCase: UpdatePersonUseCase,
    private readonly deletePersonUseCase: DeletePersonUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const person = await this.createPersonUseCase.execute(
      createPersonSchema.parse(request.body),
    );

    response.status(201).json(person);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listPersonsUseCase.execute(
      listQuerySchema.parse(request.query),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const person = await this.getPersonUseCase.execute(id);

    response.status(200).json(person);
  };

  update: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    const person = await this.updatePersonUseCase.execute(
      id,
      updatePersonSchema.parse(request.body),
    );

    response.status(200).json(person);
  };

  delete: RequestHandler = async (request, response) => {
    const { id } = idParamSchema.parse(request.params);
    await this.deletePersonUseCase.execute(id);

    response.status(204).send();
  };
}
