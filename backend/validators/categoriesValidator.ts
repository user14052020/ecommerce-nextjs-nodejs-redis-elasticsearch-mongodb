import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const categoryBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  categories_id: objectId.allow(null),
  order: Joi.number().integer().required(),
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().allow(""),
  seo: Joi.string().trim().min(1).required(),
  isActive: Joi.boolean(),
  link: Joi.string().allow(""),
});

const createCategorySchema = categoryBaseSchema;
const updateCategorySchema = categoryBaseSchema.fork(
  Object.keys(categoryBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createCategorySchema,
  updateCategorySchema,
};
