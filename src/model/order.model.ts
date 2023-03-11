import { Schema, model } from "mongoose";
import { productSchema } from "./product.model";


enum Status {
    PLACED = 0,
    PROCESSING = 1,
    DELIVERED = 2,
}


const orderSchema = new Schema({
    products: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    userId: {
        required: true,
        type: String,
    },
    orderedAt: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        default: Status.PLACED,
    },
});

const Order = model("Order", orderSchema);

export default Order;