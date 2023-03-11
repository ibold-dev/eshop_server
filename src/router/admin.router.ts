import { Router } from "express";
import admin from "../middlewares/admin.middleware";
import { Product } from "../model/product.model";
import Order from "../model/order.model";

const adminRouter = Router();

// Add product
adminRouter.post("/admin/add-product", admin, async (req: any, res: any) => {
    try {
        const { name, description, images, quantity, price, category } = req.body;
        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });
        product = await product.save();
        res.json(product);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Get all your products
adminRouter.get("/admin/get-products", admin, async (_req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Delete the product
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.get("/admin/get-orders", admin, async (_req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.post("/admin/change-order-status", admin, async (req: any, res: any) => {
    try {
        const { id, status } = req.body;
        let order: any = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.get("/admin/analytics", admin, async (_req, res) => {
    try {
        const orders: any = await Order.find({});
        let totalEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products.length; j++) {
                totalEarnings +=
                    orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }
        // CATEGORY WISE ORDER FETCHING
        let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
        let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
        let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
        let booksEarnings = await fetchCategoryWiseProduct("Books");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

        let earnings = {
            totalEarnings,
            mobileEarnings,
            essentialEarnings,
            applianceEarnings,
            booksEarnings,
            fashionEarnings,
        };

        res.json(earnings);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

async function fetchCategoryWiseProduct(category: any) {
    let earnings = 0;
    let categoryOrders: any = await Order.find({
        "products.product.category": category,
    });

    for (let i = 0; i < categoryOrders.length; i++) {
        for (let j = 0; j < categoryOrders[i].products.length; j++) {
            earnings +=
                categoryOrders[i].products[j].quantity *
                categoryOrders[i].products[j].product.price;
        }
    }
    return earnings;
}

export default adminRouter;
