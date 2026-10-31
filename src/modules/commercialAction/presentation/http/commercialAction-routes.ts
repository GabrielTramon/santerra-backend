import { Router } from "express";
import { container } from "tsyringe";

import { ensureAuthenticated } from "../../../../shared/http/middlewares/ensure-authenticated";
import { ensureTenant } from "../../../../shared/http/middlewares/ensure-tenant";
import { CommercialActionController } from "./commercialAction-controller";

export function commercialActionRouter(): Router {
  const router = Router();
  const controller = container.resolve(CommercialActionController);

  router.use(ensureAuthenticated, ensureTenant);

  router.post("/", controller.create);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
}
