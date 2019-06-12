const Joi = require('joi')

// Validate the user sign in
module.exports = {
  userSignin: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
   
  }
}
