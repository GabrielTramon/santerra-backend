import { Router } from "express";
import { container } from "tsyringe";

import { ManufacturerController } from "./manufacturer-controller";

export function manufacturerRouter(): Router {
  const router = Router();
  const controller = container.resolve(ManufacturerController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
