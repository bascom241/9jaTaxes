import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

export const generateToken = ( id, role) => {


    const secret =  process.env.JWT_SECRET
    if(!secret){
        return res.status(401).json({message: "NOT FOUND"})
    }

    const payload = {
        id,
        role
    }

    return jwt.sign(payload, secret,{expiresIn: "7d"})
}