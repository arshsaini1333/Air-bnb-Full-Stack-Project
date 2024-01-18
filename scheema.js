const joi = require("joi");

const listingScheema = joi.object({
  listing: joi.object().required(),
});
