import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const orderstatusBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  title: Joi.string().trim().min(1).required(),
  order: Joi.number().integer().required(),
  image: Joi.string().allow(""),
});

const createOrderstatusSchema = orderstatusBaseSchema;
const updateOrderstatusSchema = orderstatusBaseSchema.fork(
  Object.keys(orderstatusBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  createOrderstatusSchema,
  updateOrderstatusSchema,
};
