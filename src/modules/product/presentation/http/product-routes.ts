import { Router } from "express";
import { container } from "tsyringe";

import { ProductController } from "./product-controller";

export function productRouter(): Router {
  const router = Router();
  const controller = container.resolve(ProductController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
