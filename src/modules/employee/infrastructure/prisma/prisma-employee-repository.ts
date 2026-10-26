import { Prisma, PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { Employee } from "../../domain/entities/employee";
import {
  EmployeeRepository,
  FindEmployeesParams,
  FindEmployeesResult,
} from "../../domain/repositories/employee-repository";
import { PrismaEmployeeMapper } from "./prisma-employee-mapper";

@injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(employee: Employee): Promise<Employee> {
    const data = employee.toObject();
    const createdEmployee = await this.prisma.employee.create({ data });

    return PrismaEmployeeMapper.toDomain(createdEmployee);
  }

  async findById(
    id: string,
    companyId: string,
    includeDeleted = false,
  ): Promise<Employee | null> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        companyId,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return employee ? PrismaEmployeeMapper.toDomain(employee) : null;
  }

  async findMany(params: FindEmployeesParams): Promise<FindEmployeesResult> {
    const where: Prisma.EmployeeWhereInput = {
      companyId: params.companyId,
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
          {
            person: {
              is: {
                name: { contains: params.search, mode: "insensitive", }
              }
            },
          }
        ]
        : undefined,
    };

    const [employees, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      employees: employees.map(PrismaEmployeeMapper.toDomain),
      total,
    };
  }

  async update(employee: Employee): Promise<Employee> {
    const data = employee.toObject();
    const updatedEmployee = await this.prisma.employee.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        personId: data.personId,
        hiredAt: data.hiredAt,
        terminatedAt: data.terminatedAt,
        updatedAt: data.updatedAt,
        updatedById: data.updatedById,
      },
    });

    return PrismaEmployeeMapper.toDomain(updatedEmployee);
  }

  async delete(employee: Employee): Promise<void> {
    const data = employee.toObject();

    await this.prisma.employee.update({
      where: {
        id: data.id,
        companyId: data.companyId,
        deletedAt: null,
      },
      data: {
        deletedAt: data.deletedAt,
        deletedById: data.deletedById,
      },
    });
  }
}
