import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const productBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  isActive: Joi.boolean(),
  type: Joi.boolean(),
  categories_id: objectId.allow(null),
  brands_id: objectId.allow(null),
  code: Joi.string().allow(""),
  title: Joi.string().trim().min(1).required(),
  description_short: Joi.string().allow(""),
  description: Joi.string().allow(""),
  seo: Joi.string().trim().min(1).required(),
  order: Joi.number().integer().required(),
  price: Joi.number().min(0).required(),
  before_price: Joi.number().min(0).required(),
  variants: Joi.array(),
  variant_products: Joi.array(),
  height: Joi.number(),
  width: Joi.number(),
  length: Joi.number(),
  qty: Joi.number().integer().min(0).required(),
  saleqty: Joi.number().integer().min(0),
});

const createProductSchema = productBaseSchema;
const updateProductSchema = productBaseSchema.fork(
  Object.keys(productBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createProductSchema,
  updateProductSchema,
};
