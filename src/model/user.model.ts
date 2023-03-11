import { Schema, model } from "mongoose";
import { productSchema } from "./product.model";

enum Role {
    USER = 'user',
    SELLER = 'seller',
    ADMIN = 'admin',
}

const userSchema = new Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value: string) => {
                const RE =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(RE);
            },
            message: "Please enter a valid email address",
        },
    },
    password: {
        required: true,
        type: String,
    },
    address: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: Role.USER,
    },
    cart: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const User = model('User', userSchema);

export default User;