import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import {
  ConflictError,
  ResourceNotFoundError,
} from "../../../../shared/errors/app-error";
import { MEMBER_REPOSITORY, MemberRepository } from "../../../member";
import { PERSON_REPOSITORY, PersonRepository } from "../../../person";
import { Employee, EmployeeProps } from "../../domain/entities/employee";
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from "../../domain/repositories/employee-repository";
import { CreateEmployeeDto } from "../dtos/create-employee-dto";

@injectable()
export class CreateEmployeeUseCase {
  constructor(
    @inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: EmployeeRepository,
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
    @inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(
    input: CreateEmployeeDto,
    context: TenantContext,
  ): Promise<EmployeeProps> {
    const employee = Employee.create({
      ...input,
      companyId: context.companyId,
      createdById: context.userId,
    });

    if (!(await this.personRepository.findById(employee.personId, context.companyId))) {
      throw new ResourceNotFoundError("Pessoa não encontrada.");
    }

    if (await this.employeeRepository.findByPersonId(employee.personId, context.companyId)) {
      throw new ConflictError("Esta pessoa já está cadastrada como funcionário.");
    }

    if (employee.userCompanyId) {
      if (!(await this.memberRepository.findById(employee.userCompanyId, context.companyId))) {
        throw new ResourceNotFoundError("Membro não encontrado.");
      }

      if (
        await this.employeeRepository.findByUserCompanyId(
          employee.userCompanyId,
          context.companyId,
        )
      ) {
        throw new ConflictError("Este membro já está vinculado a outro funcionário.");
      }
    }

    const createdEmployee = await this.employeeRepository.create(employee);

    return createdEmployee.toObject();
  }
}
