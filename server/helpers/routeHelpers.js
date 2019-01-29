const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) { req.value = {}; }
      req.value['body'] = result.value;
      console.log(req.value)
      next();
    }
  },

  schemas: {
    authSchema: Joi.object().keys({
      employeeid: Joi.string().required(),
      password: Joi.string().required()
    })
  }
}