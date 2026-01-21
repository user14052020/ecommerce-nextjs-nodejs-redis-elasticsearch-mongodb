import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const homesliderBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  categories_id: objectId.allow(null),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  link: Joi.string().allow(""),
  order: Joi.number().integer().required(),
  image: Joi.string().allow(""),
  isActive: Joi.boolean(),
});

const createHomesliderSchema = homesliderBaseSchema;
const updateHomesliderSchema = homesliderBaseSchema.fork(
  Object.keys(homesliderBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createHomesliderSchema,
  updateHomesliderSchema,
};
