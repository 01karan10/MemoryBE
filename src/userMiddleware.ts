import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_secret } from "./config";

const userMiddleware = (req : Request, res : Response, next : NextFunction) : void => {
    try {
        const header = req.headers["authorization"];
        if (typeof header !== "string") {
             res.status(403).json({ message: "Missing or invalid token" });
             return;
        }

        const decoded = jwt.verify(header, JWT_secret);
        
        if (typeof decoded === "string") {
             res.status(403).json({ message: "Invalid token payload" });
             return;
        }

        req.userId = decoded.id;
        next();
    } catch (err) {
         res.status(403).json({ message: "Invalid or expired token" });
         return;
    }
};

export default userMiddleware;