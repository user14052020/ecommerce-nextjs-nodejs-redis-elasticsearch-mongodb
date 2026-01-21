import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const variantsBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow(""),
  variants: Joi.array().required(),
});

const createVariantSchema = variantsBaseSchema;
const updateVariantSchema = variantsBaseSchema.fork(
  Object.keys(variantsBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createVariantSchema,
  updateVariantSchema,
};
