import Joi from "joi";

const addressSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
});

const contactSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
});

const companyUserSchema = Joi.object({
  name: Joi.string().required(),
  mail: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const anydataSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.string().required(),
});

const settingsBaseSchema = Joi.object({
  company: Joi.string().trim().required(),
  taxnumber: Joi.string().trim().required(),
  taxcenter: Joi.string().trim().required(),
  price_icon: Joi.string().trim().required(),
  price_type: Joi.boolean().required(),
  address: Joi.array().items(addressSchema).required(),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  keywords: Joi.string().trim().required(),
  website: Joi.string().uri().required(),
  company_user: Joi.array().items(companyUserSchema).required(),
  email: Joi.array().items(contactSchema).required(),
  phone: Joi.array().items(contactSchema).required(),
  anydata: Joi.array().items(anydataSchema).required(),
  image: Joi.string().allow(""),
});

const updateSettingsSchema = settingsBaseSchema.fork(
  Object.keys(settingsBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

export {
  updateSettingsSchema,
};
