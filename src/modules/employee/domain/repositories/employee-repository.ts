import { Employee } from "../entities/employee";

export const EMPLOYEE_REPOSITORY = "EmployeeRepository";

export interface FindEmployeesParams {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindEmployeesResult {
  employees: Employee[];
  total: number;
}

export interface EmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findById(
    id: string,
    companyId: string,
    includeDeleted?: boolean,
  ): Promise<Employee | null>;
  findByPersonId(personId: string, companyId: string): Promise<Employee | null>;
  findByUserCompanyId(userCompanyId: string, companyId: string): Promise<Employee | null>;
  findManyByIds(ids: string[], companyId: string): Promise<Employee[]>;
  findMany(params: FindEmployeesParams): Promise<FindEmployeesResult>;
  update(employee: Employee): Promise<Employee>;
  delete(employee: Employee): Promise<void>;
}
