import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;        
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized", success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);     
        if (!decoded) {
            return res.status(401).json({ msg: "invalid token", success: false });
        }   
        req.id = decoded.userId;        
        next();
    } catch (error) {
        console.log(error);
    }
};