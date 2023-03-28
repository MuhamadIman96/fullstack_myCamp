const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// const extension = (joi) => ({
//   type: "string",
//   base: joi.string(),
//   message: {
//     "string.escapeHTML": "{{#label}} must not include HTML!",
//   },
//   rules: {
//     escapeHTML: {
//       validate(value, helpers) {
//         const clean = sanitizeHtml(value, {
//           allowedTags: [],
//           allowedAttributes: {},
//         });
//         if (clean !== value)
//           return helpers.error("string.escapeHTML", { value });
//         return clean;
//       },
//     },
//   },
// });

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchemaJoi = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    desc: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchemaJoi = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});
