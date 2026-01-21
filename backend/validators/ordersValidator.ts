import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const orderProductSchema = Joi.object({
  type: Joi.boolean(),
  categories_id: objectId.allow(null),
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().allow(""),
  seo: Joi.string().trim().min(1).required(),
  price: Joi.number().min(0).required(),
  before_price: Joi.number().min(0).required(),
  selectedVariants: Joi.object(),
  qty: Joi.number().integer().min(1).required(),
  height: Joi.number(),
  width: Joi.number(),
  length: Joi.number(),
});

const orderBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  customer_id: objectId.allow(null),
  paymentmethods_id: objectId.required(),
  orderstatus_id: objectId.required(),
  cargoes_id: objectId.allow(null),
  cargo_price: Joi.number().min(0).required(),
  cargo_discount_price: Joi.number().min(0).required(),
  receiver_name: Joi.string().trim().min(1).required(),
  receiver_email: Joi.string().email().required(),
  receiver_phone: Joi.string().trim().min(4).required(),
  ordernumber: Joi.string().allow(""),
  payment_intent: Joi.string().allow(""),
  total_price: Joi.number().min(0).required(),
  discount_price: Joi.number().min(0).required(),
  cargo_no: Joi.string().allow(""),
  note: Joi.string().allow(""),
  shipping_address: Joi.string().trim().min(1).required(),
  billing_address: Joi.string().trim().min(1).required(),
  products: Joi.array().items(orderProductSchema).min(1).required(),
});

const createOrderSchema = orderBaseSchema;
const updateOrderSchema = orderBaseSchema.fork(
  Object.keys(orderBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createOrderSchema,
  updateOrderSchema,
};
