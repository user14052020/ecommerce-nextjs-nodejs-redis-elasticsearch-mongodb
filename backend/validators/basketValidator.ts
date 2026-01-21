import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const addressSchema = Joi.object({
  type: Joi.boolean(),
  country_id: Joi.string().allow(""),
  state_id: Joi.string().allow(""),
  city_id: Joi.string().allow(""),
  town_id: Joi.string().allow(""),
  district_id: Joi.string().allow(""),
  village_id: Joi.string().allow(""),
  address: Joi.string().allow(""),
  name: Joi.string().allow(""),
});

const basketProductSchema = Joi.object({
  product_id: Joi.string().required(),
  selectedVariants: Joi.object(),
  qty: Joi.number().integer().min(1).required(),
  seo: Joi.string().required(),
});

const basketBaseSchema = Joi.object({
  created_user: Joi.object(),
  customer_id: objectId.allow(null),
  receiver_name: Joi.string().allow(""),
  receiver_email: Joi.string().allow(""),
  receiver_phone: Joi.string().allow(""),
  cargoes_id: objectId.allow(null),
  total_price: Joi.number().min(0),
  total_discount: Joi.number().min(0),
  cargo_price: Joi.number().min(0),
  cargo_price_discount: Joi.number().min(0),
  shipping_address: addressSchema,
  billing_address: addressSchema,
  products: Joi.array().items(basketProductSchema).required(),
});

const createBasketSchema = basketBaseSchema;
const updateBasketSchema = basketBaseSchema.fork(
  Object.keys(basketBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createBasketSchema,
  updateBasketSchema,
};
