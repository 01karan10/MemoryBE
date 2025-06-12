"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Models_1 = require("./Models/Models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield Models_1.UserModel.create({
            username: username,
            password: password
        });
        res.status(200).json({
            message: "Signup Successful"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "Username is already taken"
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const User = yield Models_1.UserModel.findOne({
        username,
        password
    });
    if (User) {
        const token = jsonwebtoken_1.default.sign({
            id: User._id
        }, config_1.JWT_secret);
        res.status(200).json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Username/Password did not match"
        });
    }
}));
app.listen(3000, () => {
    console.log("helo");
});
