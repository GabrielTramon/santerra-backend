import { Router } from "express";
import { container } from "tsyringe";

import { ResellerController } from "./reseller-controller";

export function resellerRouter(): Router {
  const router = Router();
  const controller = container.resolve(ResellerController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
