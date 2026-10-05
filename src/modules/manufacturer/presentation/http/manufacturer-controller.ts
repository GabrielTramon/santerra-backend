import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { CreateManufacturerUseCase } from "../../application/use-cases/create-manufacturer-use-case";
import { DeleteManufacturerUseCase } from "../../application/use-cases/delete-manufacturer-use-case";
import { GetManufacturerUseCase } from "../../application/use-cases/get-manufacturer-use-case";
import { ListManufacturersUseCase } from "../../application/use-cases/list-manufacturers-use-case";
import { UpdateManufacturerUseCase } from "../../application/use-cases/update-manufacturer-use-case";
import {
  parseCreateManufacturerRequest,
  parseManufacturerId,
  parseListManufacturersRequest,
  parseUpdateManufacturerRequest,
} from "./manufacturer-request-parser";

@injectable()
export class ManufacturerController {
  constructor(
    private readonly createManufacturerUseCase: CreateManufacturerUseCase,
    private readonly listManufacturersUseCase: ListManufacturersUseCase,
    private readonly getManufacturerUseCase: GetManufacturerUseCase,
    private readonly updateManufacturerUseCase: UpdateManufacturerUseCase,
    private readonly deleteManufacturerUseCase: DeleteManufacturerUseCase,
  ) {}

  create: RequestHandler = async (request, response) => {
    const manufacturer = await this.createManufacturerUseCase.execute(
      parseCreateManufacturerRequest(request),
    );

    response.status(201).json(manufacturer);
  };

  list: RequestHandler = async (request, response) => {
    const result = await this.listManufacturersUseCase.execute(
      parseListManufacturersRequest(request),
    );

    response.status(200).json(result);
  };

  getById: RequestHandler = async (request, response) => {
    const manufacturer = await this.getManufacturerUseCase.execute(parseManufacturerId(request));

    response.status(200).json(manufacturer);
  };

  update: RequestHandler = async (request, response) => {
    const manufacturer = await this.updateManufacturerUseCase.execute(
      parseManufacturerId(request),
      parseUpdateManufacturerRequest(request),
    );

    response.status(200).json(manufacturer);
  };

  delete: RequestHandler = async (request, response) => {
    await this.deleteManufacturerUseCase.execute(parseManufacturerId(request));

    response.status(204).send();
  };
}
