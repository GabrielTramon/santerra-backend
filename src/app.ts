import cors from "cors";
import express from "express";

import { makeCompanyModule } from "./modules/company";
import { errorHandler } from "./shared/http/middlewares/error-handler";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/companies", makeCompanyModule());

app.use((_request, response) => {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Rota não encontrada.",
    },
  });
});

app.use(errorHandler);
