import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const cargoesBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  title: Joi.string().trim().min(1).required(),
  price: Joi.number().min(0).required(),
  before_price: Joi.number().min(0).required(),
  link: Joi.string().trim().min(1).required(),
  order: Joi.number().integer().required(),
  image: Joi.string().allow(""),
  isActive: Joi.boolean(),
});

const createCargoSchema = cargoesBaseSchema;
const updateCargoSchema = cargoesBaseSchema.fork(
  Object.keys(cargoesBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createCargoSchema,
  updateCargoSchema,
};
