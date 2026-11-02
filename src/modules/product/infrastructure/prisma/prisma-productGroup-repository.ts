import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";

import { ProductGroupRepository } from "../../domain/repositories/productGroup-repository";

@injectable()
export class PrismaProductGroupRepository implements ProductGroupRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async createMany(
        data: {
            productId: string;
            groupId: string;
            companyId: string;
        }[],
    ): Promise<void> {
        await this.prisma.productGroup.createMany({
            data,
        });
    }
}