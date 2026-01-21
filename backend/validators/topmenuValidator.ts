import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const topmenuBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  categories_id: objectId.allow(null),
  order: Joi.number().integer().required(),
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().allow(""),
  description_short: Joi.string().allow(""),
  seo: Joi.string().trim().min(1).required(),
  isActive: Joi.boolean(),
  link: Joi.string().allow(""),
});

const createTopmenuSchema = topmenuBaseSchema;
const updateTopmenuSchema = topmenuBaseSchema.fork(
  Object.keys(topmenuBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createTopmenuSchema,
  updateTopmenuSchema,
};
