import jwt from 'jsonwebtoken';
import User from '../model/user.model';

const admin = async (req: any, res: any, next: any) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({ msg: "No auth token, access denied" });

        const verified: any = jwt.verify(token, "passwordKey");
        if (!verified)
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });
        const user: any = await User.findById(verified.id);
        if (user.type == "user" || user.type == "seller") {
            return res.status(401).json({ msg: "You are not an admin!" });
        }
        req.user = verified.id;
        req.token = token;
        next();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export default admin;