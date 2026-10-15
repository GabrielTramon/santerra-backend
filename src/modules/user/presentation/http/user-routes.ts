import { Router } from "express";
import { container } from "tsyringe";

import { UserController } from "./user-controller";

export function userRouter(): Router {
  const router = Router();
  const controller = container.resolve(UserController);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
