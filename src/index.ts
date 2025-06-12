import express from "express";
import { UserModel } from "./Models/Models";
import jwt from "jsonwebtoken";
import { JWT_secret } from "./config";
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
         await UserModel.create({
            username: username,
            password: password
        }) 
        res.status(200).json({
            message : "Signup Successful"
        })
    }
    catch(e) {
        res.status(411).json({
            message : "Username is already taken"
        })
    }
})

app.post("/signin", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const User = await UserModel.findOne({
        username, 
        password
    })

    if(User) {
        
        const token = jwt.sign({
            id : User._id
        }, JWT_secret)
        
        res.status(200).json({
            token
        })
    }
    else {
        res.status(403).json({
            message : "Username/Password did not match"
        })
    }
})



app.listen(3000, () => {
    console.log("helo");
});