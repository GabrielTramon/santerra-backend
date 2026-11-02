import { container } from "tsyringe";

import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "./domain/repositories/product-repository";
import { PrismaProductRepository } from "./infrastructure/prisma/prisma-product-repository";

import { 
  PRODUCT_GROUP_REPOSITORY, 
  ProductGroupRepository 
} from "./domain/repositories/productGroup-repository";
import { PrismaProductGroupRepository } from "./infrastructure/prisma/prisma-productGroup-repository";

container.registerSingleton<ProductRepository>(
  PRODUCT_REPOSITORY,
  PrismaProductRepository,
);

container.registerSingleton<ProductGroupRepository>(
  PRODUCT_GROUP_REPOSITORY,
  PrismaProductGroupRepository,
);
