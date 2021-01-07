const Joi = require('joi');

const userSignup = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .alphanum()
            .max(30)
            .required(),
        lastName: Joi.string()
            .alphanum()
            .max(30)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
        phone: Joi.number().min(9)
    });
    return schema.validate(data);
}

const userLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    });
    return schema.validate(data);
}

module.exports.userSignup = userSignup;
module.exports.userLogin = userLogin;

