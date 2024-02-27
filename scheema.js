const joi = require("joi");
module.exports.listingScheema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      location: joi.string().required(),
      country: joi.string().required(),
      image: joi.string().allow("", null),
      contact: joi.string().required().length(10),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
