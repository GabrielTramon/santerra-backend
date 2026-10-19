import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
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
    const createdEmployee = await this.employeeRepository.create(employee);

    return createdEmployee.toObject();
  }
}
