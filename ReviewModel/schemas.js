const Joi = require('joi');
const { number } = require('joi');


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required()
    }).required()
})

