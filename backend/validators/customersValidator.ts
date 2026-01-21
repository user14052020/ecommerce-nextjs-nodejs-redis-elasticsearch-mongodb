import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const addressSchema = Joi.object({
  type: Joi.boolean(),
  name: Joi.string().allow(""),
  country_id: Joi.string().allow(""),
  state_id: Joi.string().allow(""),
  city_id: Joi.string().allow(""),
  town_id: Joi.string().allow(""),
  district_id: Joi.string().allow(""),
  village_id: Joi.string().allow(""),
  address: Joi.string().allow(""),
});

const customerBaseSchema = Joi.object({
  created_user: Joi.object({
    name: Joi.string().required(),
    id: objectId.required(),
  }).required(),
  isActive: Joi.boolean(),
  isCustomer: Joi.boolean(),
  name: Joi.string().allow(""),
  surname: Joi.string().allow(""),
  username: Joi.string().trim().min(3).required(),
  password: Joi.string().min(6),
  role: Joi.object(),
  image: Joi.string().allow(""),
  company: Joi.string().allow(""),
  taxoffice: Joi.string().allow(""),
  taxnumber: Joi.string().allow(""),
  ssn: Joi.string().allow(""),
  executive: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  prefix: Joi.string().allow(""),
  fax: Joi.string().allow(""),
  web: Joi.string().allow(""),
  risk: Joi.number(),
  address: Joi.array().items(addressSchema),
  spesific_id: Joi.string().allow(""),
  resetPasswordToken: Joi.string().allow(""),
  resetPasswordExpires: Joi.date(),
});

const createCustomerSchema = customerBaseSchema.fork(["password"], (schema) =>
  schema.required()
);
const updateCustomerSchema = customerBaseSchema.fork(
  Object.keys(customerBaseSchema.describe().keys || {}),
  (schema) => schema.optional()
).min(1);

const updateCustomerPasswordSchema = Joi.object({
  _id: objectId.required(),
  password: Joi.string().min(6).required(),
});

const updateCustomerAddressSchema = Joi.array().items(addressSchema).required();

export {
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerPasswordSchema,
  updateCustomerAddressSchema,
};
