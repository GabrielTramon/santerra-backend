import { inject, injectable } from "tsyringe";

import {
  PASSWORD_HASHER,
  PasswordHasher,
} from "../../../../shared/application/cryptography/password-hasher";
import {
  TOKEN_PROVIDER,
  TokenProvider,
} from "../../../../shared/application/cryptography/token-provider";
import { ConflictError } from "../../../../shared/errors/app-error";
import { Company } from "../../../company";
import { Member } from "../../../member";
import { PERMISSION_REPOSITORY, PermissionRepository } from "../../../permission";
import { Role } from "../../../role";
import { User, USER_REPOSITORY, UserRepository } from "../../../user";
import {
  AUTH_REPOSITORY,
  AuthRepository,
} from "../../domain/repositories/auth-repository";
import { SignUpDto } from "../dtos/sign-up-dto";
import { SignUpResultDto } from "../dtos/sign-up-result-dto";

const OWNER_ROLE_NAME = "Administrador";
const OWNER_ROLE_DESCRIPTION = "Acesso a todas as funcionalidades da empresa.";

@injectable()
export class SignUpUseCase {
  constructor(
    @inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepository,
    @inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute(input: SignUpDto): Promise<SignUpResultDto> {
    const email = User.normalizeEmail(input.email);

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError("Já existe um usuário com este e-mail.");
    }

    const user = User.create({
      name: input.name,
      email,
      passwordHash: await this.passwordHasher.hash(input.password),
    });
    const company = Company.create({
      name: input.companyName,
      createdById: user.id,
    });
    const permissions = await this.permissionRepository.findAll();
    const ownerRole = Role.create({
      name: OWNER_ROLE_NAME,
      description: OWNER_ROLE_DESCRIPTION,
      companyId: company.id,
      permissionIds: permissions.map((permission) => permission.id),
      createdById: user.id,
    });
    const owner = Member.create({
      userId: user.id,
      companyId: company.id,
      name: user.name,
      email: user.email,
      isOwner: true,
      roleIds: [ownerRole.id],
      createdById: user.id,
    });

    await this.authRepository.createCompanyWithOwner({
      user,
      company,
      ownerRole,
      owner,
    });

    return {
      token: this.tokenProvider.sign({ userId: user.id, companyId: company.id }),
      user: user.toPublicObject(),
      company: company.toObject(),
    };
  }
}
