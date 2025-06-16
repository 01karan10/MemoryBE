"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        if (typeof header !== "string") {
            res.status(403).json({ message: "Missing or invalid token" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_secret);
        if (typeof decoded === "string") {
            res.status(403).json({ message: "Invalid token payload" });
            return;
        }
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
};
exports.default = userMiddleware;
