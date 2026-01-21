import mongoose, { Model } from "mongoose";

import Settings from "@app/models/settings.model";
import settingsData from "@app/db.json/nextjs.settings.json";

import Users from "@app/models/users.model";
import usersData from "@app/db.json/nextjs.users.json";

import Variants from "@app/models/variants.model";
import variantsData from "@app/db.json/nextjs.variants.json";

import Turkey from "@app/models/turkey.model";
import turkeyData from "@app/db.json/nextjs.turkey.json";

import Topmenu from "@app/models/topmenu.model";
import topmenuData from "@app/db.json/nextjs.topmenu.json";

import Productimages from "@app/models/productimages.model";
import productimagesData from "@app/db.json/nextjs.productimages.json";

import Products from "@app/models/products.model";
import productsData from "@app/db.json/nextjs.products.json";

import Paymentmethods from "@app/models/paymentmethods.model";
import paymentmethodsData from "@app/db.json/nextjs.paymentmethods.json";

import Orderstatus from "@app/models/orderstatus.model";
import orderstatusData from "@app/db.json/nextjs.orderstatus.json";

import Orders from "@app/models/orders.model";
import ordersData from "@app/db.json/nextjs.orders.json";

import Homeslider from "@app/models/homeslider.model";
import homesliderData from "@app/db.json/nextjs.homeslider.json";

import Country from "@app/models/country.model";
import countryData from "@app/db.json/nextjs.country.json";

import Categories from "@app/models/categories.model";
import categoriesData from "@app/db.json/nextjs.categories.json";

import Cargoes from "@app/models/cargoes.model";
import cargoesData from "@app/db.json/nextjs.cargoes.json";

import Brands from "@app/models/brands.model";
import brandsData from "@app/db.json/nextjs.brands.json";

const SeedMetaSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "seed_meta" }
);

const SeedMeta = mongoose.model("SeedMeta", SeedMetaSchema);

const normalizeSeedData = (data: unknown): Record<string, unknown>[] => {
  const sanitized = JSON.stringify(data)
    .replace(/\\"/g, "")
    .replace(/ObjectId\(/g, "")
    .replace(/\)"/g, '"');
  const parsed = JSON.parse(sanitized) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Seed data must be an array");
  }
  return parsed as Record<string, unknown>[];
};

type SeedCollection = {
  model: Model<any>;
  data: unknown;
  name: string;
};

const seedCollections: SeedCollection[] = [
  { model: Settings, data: settingsData, name: "Settings" },
  { model: Users, data: usersData, name: "Users" },
  { model: Variants, data: variantsData, name: "Variants" },
  { model: Turkey, data: turkeyData, name: "Turkey" },
  { model: Topmenu, data: topmenuData, name: "Topmenu" },
  { model: Productimages, data: productimagesData, name: "Productimages" },
  { model: Products, data: productsData, name: "Products" },
  { model: Paymentmethods, data: paymentmethodsData, name: "Paymentmethods" },
  { model: Orderstatus, data: orderstatusData, name: "Orderstatus" },
  { model: Orders, data: ordersData, name: "Orders" },
  { model: Homeslider, data: homesliderData, name: "Homeslider" },
  { model: Country, data: countryData, name: "Country" },
  { model: Categories, data: categoriesData, name: "Categories" },
  { model: Cargoes, data: cargoesData, name: "Cargoes" },
  { model: Brands, data: brandsData, name: "Brands" },
];

type SeedResult =
  | { seeded: true }
  | { seeded: false; reason: "already_seeded" | "data_exists" };

const seedDatabaseIfNeeded = async (): Promise<SeedResult> => {
  const alreadySeeded = await SeedMeta.findOne({ key: "initial_seed" }).lean();
  if (alreadySeeded) {
    return { seeded: false, reason: "already_seeded" };
  }

  const hasSettings = await Settings.exists({});
  if (hasSettings) {
    return { seeded: false, reason: "data_exists" };
  }

  for (const collection of seedCollections) {
    const payload = normalizeSeedData(collection.data);
    await collection.model.insertMany(payload);
  }

  await SeedMeta.create({ key: "initial_seed" });
  return { seeded: true };
};

export { seedDatabaseIfNeeded };
