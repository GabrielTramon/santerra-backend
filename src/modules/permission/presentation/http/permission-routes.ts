import { Router } from "express";
import { container } from "tsyringe";

import { PermissionController } from "./permission-controller";

export function permissionRouter(): Router {
  const router = Router();
  const controller = container.resolve(PermissionController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
