import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
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
  ) {}

  async execute(
    id: string,
    input: UpdateEmployeeDto,
    context: TenantContext,
  ): Promise<EmployeeProps> {
    const employee = await this.employeeRepository.findById(id, context.companyId);

    if (!employee) {
      throw new ResourceNotFoundError("Funcionário.");
    }

    employee.update({ ...input, updatedById: context.userId });
    const updatedEmployee = await this.employeeRepository.update(employee);

    return updatedEmployee.toObject();
  }
}
