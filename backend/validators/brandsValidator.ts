import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const brandBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  title: Joi.string().trim().min(1).required(),
  order: Joi.number().integer().required(),
  description: Joi.string().allow(""),
  seo: Joi.string().trim().min(1).required(),
  image: Joi.string().allow(""),
  isActive: Joi.boolean(),
});

const createBrandSchema = brandBaseSchema;
const updateBrandSchema = brandBaseSchema.fork(
  Object.keys(brandBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createBrandSchema,
  updateBrandSchema,
};
