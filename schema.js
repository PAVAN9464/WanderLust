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
        country:Joi.string().trim().required(),
        category:Joi.string().valid(
            "Beach",
            "Mountain",
            "City",
            "Countryside",
            "Luxury",
            "Cabin",
            "Villa"
        ).required()
    }).required()
});

const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().trim().required()
    }).required()
});

module.exports={listingSchema, reviewSchema};