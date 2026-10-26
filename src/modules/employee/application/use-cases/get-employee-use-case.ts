import { inject, injectable } from "tsyringe";

import { TenantContext } from "../../../../shared/application/auth/auth-context";
import { ResourceNotFoundError } from "../../../../shared/errors/app-error";
import { EmployeeProps } from "../../domain/entities/employee";
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from "../../domain/repositories/employee-repository";

@injectable()
export class GetEmployeeUseCase {
  constructor(
    @inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: string, context: TenantContext): Promise<EmployeeProps> {
    const employee = await this.employeeRepository.findById(id, context.companyId);

    if (!employee) {
      throw new ResourceNotFoundError("Funcionário.");
    }

    return employee.toObject();
  }
}
