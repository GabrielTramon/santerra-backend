import { Router } from "express";

import { CompanyController } from "./company-controller";

export function createCompanyRouter(controller: CompanyController): Router {
  const router = Router();

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
