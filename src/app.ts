import cors from "cors";
import express from "express";
import { z } from "zod";

import "./shared/container";
import { companyRouter } from "./modules/company";
import { productRouter } from "./modules/product";
import { manufacturerRouter } from "./modules/manufacturer";
import { personRouter } from "./modules/person";

import { errorHandler } from "./shared/http/middlewares/error-handler";

z.config(z.locales.ptBR());

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/companies", companyRouter());
app.use("/products", productRouter());
app.use("/manufacturers", manufacturerRouter());
app.use("/persons", personRouter());

app.use((_request, response) => {
  response.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Rota não encontrada.",
    },
  });
});

app.use(errorHandler);
