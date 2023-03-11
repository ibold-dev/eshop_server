import express from 'express';
import morgan from 'morgan';
import authRouter from './router/auth.router';
import adminRouter from './router/admin.router';
import userRouter from './router/user.router';
import mongoose from 'mongoose';
import productRouter from './router/product.router';

// Init
const app = express();


// Constants
const PORT = 3000;
const DB =
    "mongodb+srv://rivaan:rivaan123@cluster0.wpyhk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// Connections
mongoose
    .connect(DB)
    .then(() => {
        console.log("Connection to Db Successful");
    })
    .catch((e) => {
        console.log(e);
    });


// Start Server

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server has started");
});
