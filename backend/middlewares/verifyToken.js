
import jwt from "jsonwebtoken"
export const verifyToken = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token Provided" })
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Invalid Token Passed" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:error})
    }

}