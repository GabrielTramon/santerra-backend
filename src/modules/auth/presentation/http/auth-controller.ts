import { RequestHandler } from "express";
import { injectable } from "tsyringe";

import { getAuthContext } from "../../../../shared/http/request-context";
import { GetSessionUseCase } from "../../application/use-cases/get-session-use-case";
import { LoginUseCase } from "../../application/use-cases/login-use-case";
import { SelectCompanyUseCase } from "../../application/use-cases/select-company-use-case";
import { SignUpUseCase } from "../../application/use-cases/sign-up-use-case";
import {
  loginSchema,
  selectCompanySchema,
  signUpSchema,
} from "./auth-schemas";

@injectable()
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly selectCompanyUseCase: SelectCompanyUseCase,
    private readonly getSessionUseCase: GetSessionUseCase,
  ) {}

  signUp: RequestHandler = async (request, response) => {
    const result = await this.signUpUseCase.execute(
      signUpSchema.parse(request.body),
    );

    response.status(201).json(result);
  };

  login: RequestHandler = async (request, response) => {
    const result = await this.loginUseCase.execute(
      loginSchema.parse(request.body),
    );

    response.status(200).json(result);
  };

  selectCompany: RequestHandler = async (request, response) => {
    const result = await this.selectCompanyUseCase.execute(
      selectCompanySchema.parse(request.body),
      getAuthContext(request),
    );

    response.status(200).json(result);
  };

  me: RequestHandler = async (request, response) => {
    const session = await this.getSessionUseCase.execute(
      getAuthContext(request),
      request.tenant ?? null,
    );

    response.status(200).json(session);
  };
}
