const Joi = require("joi");

const userValidationSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    phone: Joi.string()
        .pattern(new RegExp('^\\d{10}$'))
        .required()
        .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits",
            "any.required": "Phone number is required",
        })
        .label("Phone"),
    location: Joi.string().required().label("Location")
});

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%&*]{5}$'))
        .required()
        .messages({
            "string.pattern.base": `Password should be 5 characters`,
            "string.empty": `Password cannot be empty`,
            "any.required": `Password is required`,
        })
});

module.exports = { userValidationSchema, loginValidationSchema }