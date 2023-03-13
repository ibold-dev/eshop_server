import { Router } from "express";
import User from "../model/user.model";
import { hashSync, compareSync } from "bcrypt";
import jwt from 'jsonwebtoken';
import auth from "../middlewares/auth.middleware";

// Init
const authRouter = Router();

// SIGN UP
authRouter.post("/api/signup", async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body;

        const existingUser: any = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "User with same email already exists!" });
        }

        const hashedPassword = await hashSync(password, 8);

        let user = new User({
            email,
            password: hashedPassword,
            name,
        });
        user = await user.save();
        res.status(200).json(user);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// Sign In Route
// Exercise
authRouter.post("/api/signin", async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        const user: any = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ error: "User with this email does not exist!" });
        }

        const isMatch = await compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified: any = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);

        const user: any = await User.findById(verified.id);
        if (!user) return res.json(false);
        res.json(true);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

// get user data
authRouter.get("/", auth, async (req: any, res: any) => {
    const user: any = await User.findById(req.user);
    res.status(200).json({ ...user._doc, token: req.token });
});

export default authRouter;