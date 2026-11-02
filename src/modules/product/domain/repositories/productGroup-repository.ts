export const PRODUCT_GROUP_REPOSITORY = "ProductGroupRepository";

export interface ProductGroupRepository {
    createMany (
        data: {
            productId: string;
            groupId: string;
            companyId: string;
        } []
    ): Promise<void>
}
