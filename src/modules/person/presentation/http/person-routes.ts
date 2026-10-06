import { Router } from "express";
import { container } from "tsyringe";

import { PersonController } from "./person-controller";

export function personRouter(): Router {
  const router = Router();
  const controller = container.resolve(PersonController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
