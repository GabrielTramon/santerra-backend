import { Product } from "../entities/product";

export const PRODUCT_REPOSITORY = "ProductRepository";

export interface FindProductsParams {
  page: number;
  limit: number;
  search?: string;
  includeDeleted: boolean;
}

export interface FindProductsResult {
  products: Product[];
  total: number;
}

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string, includeDeleted?: boolean): Promise<Product | null>;
  findMany(params: FindProductsParams): Promise<FindProductsResult>;
  update(product: Product): Promise<Product>;
  delete(product: Product): Promise<void>;
}
