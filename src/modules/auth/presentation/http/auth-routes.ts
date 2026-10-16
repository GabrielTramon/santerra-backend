import { Router } from "express";
import { container } from "tsyringe";

import { ensureAuthenticated } from "../../../../shared/http/middlewares/ensure-authenticated";
import { AuthController } from "./auth-controller";

export function authRouter(): Router {
  const router = Router();
  const controller = container.resolve(AuthController);

  router.post("/sign-up", controller.signUp);
  router.post("/login", controller.login);
  router.post("/select-company", ensureAuthenticated, controller.selectCompany);
  router.get("/me", ensureAuthenticated, controller.me);

  return router;
}
