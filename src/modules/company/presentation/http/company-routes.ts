import { Router } from "express";
import { container } from "tsyringe";

import { CompanyController } from "./company-controller";

export function companyRouter(): Router {
  const router = Router();
  const controller = container.resolve(CompanyController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
