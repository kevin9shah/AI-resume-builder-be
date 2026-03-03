import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userID || decoded.userId;
        req.userID = userId;
        req.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

export default protect;
