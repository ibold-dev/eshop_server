import jwt from 'jsonwebtoken'

const auth = async (req: any, res: any, next: any) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({ msg: "No auth token, access denied" });

        const verified: any = jwt.verify(token, "passwordKey");
        if (!verified)
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });

        req.user = verified.id;
        req.token = token;
        next();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export default auth;