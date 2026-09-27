import { Prisma, PrismaClient } from "@prisma/client";

import { Company } from "../../domain/entities/company";
import {
  CompanyRepository,
  FindCompaniesParams,
  FindCompaniesResult,
} from "../../domain/repositories/company-repository";
import { PrismaCompanyMapper } from "./prisma-company-mapper";

export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(company: Company): Promise<Company> {
    const data = company.toObject();
    const createdCompany = await this.prisma.company.create({ data });

    return PrismaCompanyMapper.toDomain(createdCompany);
  }

  async findById(id: string, includeDeleted = false): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return company ? PrismaCompanyMapper.toDomain(company) : null;
  }

  async findMany(params: FindCompaniesParams): Promise<FindCompaniesResult> {
    const where: Prisma.CompanyWhereInput = {
      deletedAt: params.includeDeleted ? undefined : null,
      OR: params.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [companies, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      companies: companies.map(PrismaCompanyMapper.toDomain),
      total,
    };
  }

  async save(company: Company): Promise<Company> {
    const data = company.toObject();
    const updatedCompany = await this.prisma.company.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        description: data.description,
        logo: data.logo,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        updatedById: data.updatedById,
        deletedById: data.deletedById,
      },
    });

    return PrismaCompanyMapper.toDomain(updatedCompany);
  }
}
