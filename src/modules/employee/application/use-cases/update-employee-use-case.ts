import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import {
  ConflictError,
  ResourceNotFoundError,
} from "../../../../shared/errors/app-error";
import { MEMBER_REPOSITORY, MemberRepository } from "../../../member";
import { PERSON_REPOSITORY, PersonRepository } from "../../../person";
import { EmployeeProps } from "../../domain/entities/employee";
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from "../../domain/repositories/employee-repository";
import { UpdateEmployeeDto } from "../dtos/update-employee-dto";

@injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: EmployeeRepository,
    @inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepository,
    @inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateEmployeeDto,
    context: TenantContext,
  ): Promise<EmployeeProps> {
    const employee = await this.employeeRepository.findById(id, context.companyId);

    if (!employee) {
      throw new ResourceNotFoundError("Funcionário não encontrado.");
    }

    employee.update({ ...input, updatedById: context.userId });

    if (input.personId !== undefined) {
      if (!(await this.personRepository.findById(employee.personId, context.companyId))) {
        throw new ResourceNotFoundError("Pessoa não encontrada.");
      }

      const owner = await this.employeeRepository.findByPersonId(
        employee.personId,
        context.companyId,
      );

      if (owner && owner.id !== employee.id) {
        throw new ConflictError("Esta pessoa já está cadastrada como funcionário.");
      }
    }

    if (input.userCompanyId && employee.userCompanyId) {
      if (!(await this.memberRepository.findById(employee.userCompanyId, context.companyId))) {
        throw new ResourceNotFoundError("Membro não encontrado.");
      }

      const owner = await this.employeeRepository.findByUserCompanyId(
        employee.userCompanyId,
        context.companyId,
      );

      if (owner && owner.id !== employee.id) {
        throw new ConflictError("Este membro já está vinculado a outro funcionário.");
      }
    }

    const updatedEmployee = await this.employeeRepository.update(employee);

    return updatedEmployee.toObject();
  }
}
