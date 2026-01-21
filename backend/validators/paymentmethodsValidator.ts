import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const paymentmethodBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  title: Joi.string().trim().min(1).required(),
  contract: Joi.string().allow(""),
  isActive: Joi.boolean(),
  order: Joi.number().integer().required(),
  public_key: Joi.string().allow(""),
  secret_key: Joi.string().allow(""),
  api: Joi.array(),
});

const createPaymentmethodSchema = paymentmethodBaseSchema;
const updatePaymentmethodSchema = paymentmethodBaseSchema.fork(
  Object.keys(paymentmethodBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createPaymentmethodSchema,
  updatePaymentmethodSchema,
};
