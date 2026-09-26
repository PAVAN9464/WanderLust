const Joi=require("joi");

const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().trim().required(),
        description:Joi.string().trim().required(),
        image:Joi.object({
            filename:Joi.string(),
            url:Joi.string().uri().allow("")
        }),
        price:Joi.number().min(0).required(),
        location:Joi.string().trim().required(),
        country:Joi.string().trim().required()
    }).required()
});

module.exports={listingSchema};