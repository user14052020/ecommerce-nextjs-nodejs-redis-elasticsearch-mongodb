import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { exceptionHandler } from "@app/core/exceptionHandlers";
import { SearchService } from "@app/services/searchService";
import { seedDatabaseIfNeeded } from "@app/seed/seedDatabase";

import "dotenv/config";

const app = express();
const port = Number(process.env.PORT) || 5001;

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "..", "..", "admin", "public")));

app.use(helmet());

app.use(mongoSanitize());
app.use(compression());
app.use(cookieParser());
const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8000",
];
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = corsOrigins.length > 0 ? corsOrigins : defaultCorsOrigins;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1gb" }));
app.use(
  express.urlencoded({ limit: "1gb", extended: true, parameterLimit: 50000 })
);

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("ATLAS_URI is not set");
}

mongoose.connect(uri);

const connection = mongoose.connection;
const searchService = new SearchService();

connection.once("open", async () => {
  console.log("connection MongoDB");
  try {
    const result = await seedDatabaseIfNeeded();
    if (result.seeded) {
      console.log("seeded initial data");
    }
  } catch (error) {
    console.error("seed failed", error);
  }

  try {
    await searchService.ensureIndices();
    if (process.env.ELASTICSEARCH_REINDEX_ON_START !== "false") {
      await searchService.reindexAll();
    }
  } catch (error) {
    console.error("search index init failed", error);
  }
});

//instalition db import
import installDB from "@app/routes/installdb";
app.use("/installdb", installDB);
//instalition

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

import apiV1Router from "@app/routes/apiV1";
app.use("/api/v1", apiV1Router);

//Private Root import
import turkeyRouter from "@app/routes/turkey";
import userRouter from "@app/routes/users";
import uploadRouter from "@app/routes/upload";
import staffRouter from "@app/routes/staff";
import customerRouter from "@app/routes/customers";
import countryRouter from "@app/routes/country";
import productsRouter from "@app/routes/products";
import productimagesRouter from "@app/routes/productimages";
import variantsRouter from "@app/routes/variants";
import categoriesRouter from "@app/routes/categories";
import cargoesRouter from "@app/routes/cargoes";
import homeSliderRouter from "@app/routes/homeslider";
import ordersRouter from "@app/routes/orders";
import orderstatusRouter from "@app/routes/orderstatus";
import brandsRouter from "@app/routes/brands";
import paymentmethodsRouter from "@app/routes/paymentmethods";
import topmenuRouter from "@app/routes/topmenu";
import settingsRouter from "@app/routes/settings";
import basketRouter from "@app/routes/basket";

//Public Root import
import settingsPublicRouter from "@app/routes/settingspublic";
import topmenuPublicRouter from "@app/routes/topmenupublic";
import categoriesPublicRouter from "@app/routes/categoriespublic";
import brandsPublicRouter from "@app/routes/brandspublic";
import homeSliderPublicRouter from "@app/routes/homesliderpublic";
import productsPublicRouter from "@app/routes/productspublic";
import cargoesPublicRouter from "@app/routes/cargoespublic";
import customerPublicRouter from "@app/routes/customerspublic";
import paymentPublicRouter from "@app/routes/payment";
import paymentMethodsPublicRouter from "@app/routes/paymentmethodspublic";

//Private Root
app.use("/cargoes", cargoesRouter);
app.use("/homeslider", homeSliderRouter);
app.use("/orders", ordersRouter);
app.use("/orderstatus", orderstatusRouter);
app.use("/paymentmethods", paymentmethodsRouter);
app.use("/topmenu", topmenuRouter);
app.use("/users", userRouter);
app.use("/staff", staffRouter);
app.use("/customers", customerRouter);
app.use("/country", countryRouter);
app.use("/products", productsRouter);
app.use("/productimages", productimagesRouter);
app.use("/variants", variantsRouter);
app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);
app.use("/turkey", turkeyRouter);
app.use("/upload", uploadRouter);
app.use("/settings", settingsRouter);
app.use("/basket", basketRouter);

//public Root
app.use("/settingspublic", settingsPublicRouter);
app.use("/topmenupublic", topmenuPublicRouter);
app.use("/categoriespublic", categoriesPublicRouter);
app.use("/brandspublic", brandsPublicRouter);
app.use("/homesliderpublic", homeSliderPublicRouter);
app.use("/productspublic", productsPublicRouter);
app.use("/cargoespublic", cargoesPublicRouter);
app.use("/customerspublic", customerPublicRouter);
app.use("/payment", paymentPublicRouter);
app.use("/paymentmethodspublic", paymentMethodsPublicRouter);

app.use(exceptionHandler);

app.listen(port, () => {
  console.log("sever is runnin port: " + port);
});
