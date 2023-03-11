import { Schema, model } from "mongoose";
import ratingSchema from "./rating.model";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    ratings: [ratingSchema],
});

const Product = model('Product', productSchema);

export { productSchema, Product };