import { Router } from "express";
import { container } from "tsyringe";

import { PotentialController } from "./potential-controller";

export function potentialRouter(): Router {
  const router = Router();
  const controller = container.resolve(PotentialController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
