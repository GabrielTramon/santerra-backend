import { Router } from "express";
import { container } from "tsyringe";

import { PERMISSIONS } from "../../../../shared/application/auth/permissions";
import { ensureAuthenticated } from "../../../../shared/http/middlewares/ensure-authenticated";
import { ensurePermission } from "../../../../shared/http/middlewares/ensure-permission";
import { ensurePlatformAdmin } from "../../../../shared/http/middlewares/ensure-platform-admin";
import { ensureTenant } from "../../../../shared/http/middlewares/ensure-tenant";
import { CompanyController } from "./company-controller";

export function companyRouter(): Router {
  const router = Router();
  const controller = container.resolve(CompanyController);

  router.use(ensureAuthenticated);

  router.get("/current", ensureTenant, controller.getCurrent);
  router.patch(
    "/current",
    ensureTenant,
    ensurePermission(PERMISSIONS.COMPANY_UPDATE),
    controller.updateCurrent,
  );

  router.post("/", ensurePlatformAdmin, controller.create);
  router.get("/", ensurePlatformAdmin, controller.list);
  router.get("/:id", ensurePlatformAdmin, controller.getById);
  router.patch("/:id", ensurePlatformAdmin, controller.update);
  router.delete("/:id", ensurePlatformAdmin, controller.delete);

  return router;
}
