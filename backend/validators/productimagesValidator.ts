import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const productimagesBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  isActive: Joi.boolean(),
  product_id: objectId.required(),
  title: Joi.string().allow(""),
  order: Joi.number().integer().required(),
  image: Joi.string().required(),
});

const createProductimageSchema = productimagesBaseSchema;
const updateProductimageSchema = productimagesBaseSchema.fork(
  Object.keys(productimagesBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createProductimageSchema,
  updateProductimageSchema,
};
