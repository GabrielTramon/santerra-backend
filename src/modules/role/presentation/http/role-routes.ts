import { Router } from "express";
import { container } from "tsyringe";

import { RoleController } from "./role-controller";

export function roleRouter(): Router {
  const router = Router();
  const controller = container.resolve(RoleController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
