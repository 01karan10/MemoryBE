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
const userMiddleware_1 = __importDefault(require("./userMiddleware"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
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
        res.status(409).json({
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
app.get("/api/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield Models_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    const content = yield Models_1.ContentModel.find({
        userId: link.userId
    });
    res.json({
        content
    });
}));
app.use(userMiddleware_1.default);
app.post("/api/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title } = req.body;
        const userId = req.userId;
        const content = yield Models_1.ContentModel.create({
            title,
            link,
            type,
            userId
        });
        res.status(201).json({ message: "Content created", content });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
app.get("/api/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const content = yield Models_1.ContentModel.find({
            userId
        });
        res.status(201).json({ content });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
app.get("/api/content/youtube", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = "youtube";
    const userId = req.userId;
    try {
        const content = yield Models_1.ContentModel.find({
            userId,
            type
        });
        res.status(201).json({ content });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
app.get("/api/content/twitter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = "twitter";
    const userId = req.userId;
    try {
        const content = yield Models_1.ContentModel.find({
            userId,
            type
        });
        res.status(201).json({ content });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}));
app.delete("/api/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    const userId = req.userId;
    yield Models_1.ContentModel.findOneAndDelete({
        _id: contentId,
        userId
    });
    res.json({
        message: "Deleted"
    });
}));
app.post("/api/brain/share", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    const userId = req.userId;
    if (share) {
        const link = yield Models_1.LinkModel.findOne({
            userId
        });
        if (link) {
            res.json({
                hash: link
            });
        }
        else {
            const hash = (0, config_1.GenerateHash)(20);
            yield Models_1.LinkModel.create({
                userId,
                hash
            });
        }
    }
    else {
        yield Models_1.LinkModel.deleteOne({
            userId
        });
        res.json({
            message: "Sharing off"
        });
    }
}));
app.listen(3000, () => {
    console.log("helo");
});
