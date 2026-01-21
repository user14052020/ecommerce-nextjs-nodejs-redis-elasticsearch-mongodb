import { Router } from "express";

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

const router = Router();

router.use("/cargoes", cargoesRouter);
router.use("/homeslider", homeSliderRouter);
router.use("/orders", ordersRouter);
router.use("/orderstatus", orderstatusRouter);
router.use("/paymentmethods", paymentmethodsRouter);
router.use("/topmenu", topmenuRouter);
router.use("/users", userRouter);
router.use("/staff", staffRouter);
router.use("/customers", customerRouter);
router.use("/country", countryRouter);
router.use("/products", productsRouter);
router.use("/productimages", productimagesRouter);
router.use("/variants", variantsRouter);
router.use("/categories", categoriesRouter);
router.use("/brands", brandsRouter);
router.use("/turkey", turkeyRouter);
router.use("/upload", uploadRouter);
router.use("/settings", settingsRouter);
router.use("/basket", basketRouter);

router.use("/settingspublic", settingsPublicRouter);
router.use("/topmenupublic", topmenuPublicRouter);
router.use("/categoriespublic", categoriesPublicRouter);
router.use("/brandspublic", brandsPublicRouter);
router.use("/homesliderpublic", homeSliderPublicRouter);
router.use("/productspublic", productsPublicRouter);
router.use("/cargoespublic", cargoesPublicRouter);
router.use("/customerspublic", customerPublicRouter);
router.use("/payment", paymentPublicRouter);
router.use("/paymentmethodspublic", paymentMethodsPublicRouter);

export default router;
