const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(10).required(),
  image: Joi.string().trim().uri().allow(""),
  price: Joi.number().min(0).required(),
  location: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
});

module.exports.reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().required(),
});
