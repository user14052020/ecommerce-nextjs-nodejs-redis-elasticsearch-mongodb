import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().allow(""),
  surname: Joi.string().allow(""),
  prefix: Joi.string().allow(""),
  phone: Joi.string().allow(""),
});

const updatePasswordViaEmailSchema = Joi.object({
  username: Joi.string().email().required(),
  resetPasswordToken: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const forgotPasswordSchema = Joi.object({
  username: Joi.string().email().required(),
});

export {
  registerSchema,
  updatePasswordViaEmailSchema,
  forgotPasswordSchema,
};
