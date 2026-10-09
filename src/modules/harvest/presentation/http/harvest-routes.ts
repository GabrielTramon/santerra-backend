import { Router } from "express";
import { container } from "tsyringe";

import { HarvestController } from "./harvest-controller";

export function harvestRouter(): Router {
  const router = Router();
  const controller = container.resolve(HarvestController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
