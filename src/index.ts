import express from "express";
import { ContentModel, LinkModel, UserModel } from "./Models/Models";
import jwt from "jsonwebtoken";
import { JWT_secret, GenerateHash } from "./config";
import userMiddleware from "./userMiddleware";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

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
            res.status(409).json({
            message: "Username is already taken"
        });

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

app.get("/api/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    const content = await ContentModel.find({
        userId: link.userId
    })

    res.json({
        content
    })

})

app.use(userMiddleware)

app.post("/api/content", async (req, res) => {
    
   try {
    const { link, type, title } = req.body;
    const userId = req.userId;
    const content = await ContentModel.create({
      title,
      link,
      type,
      userId
    });

    res.status(201).json({ message: "Content created", content });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
})

app.get("/api/content", async (req, res) => {
     
    const userId = req.userId;
    try {
        const content = await ContentModel.find({
            userId
        })
        res.status(201).json({ content });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
})

app.get("/api/content/youtube", async (req, res) => {
    const type = "youtube"
    const userId = req.userId;
    try {
        const content = await ContentModel.find({
            userId,
            type
        })
        res.status(201).json({ content });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
})

app.get("/api/content/twitter", async (req, res) => {
    const type = "twitter"
    const userId = req.userId;
    try {
        const content = await ContentModel.find({
            userId,
            type
        })
        res.status(201).json({ content });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
})

app.delete("/api/content", async (req, res) => {
    const contentId = req.body.contentId;
    
    const userId = req.userId;
    try {
        await ContentModel.findOneAndDelete({
            _id : contentId,
            userId
        })

        res.status(200).json({
            message: "Deleted"
        })
    } catch (error) {
        res.status(500).json({error})
    }
})

app.post("/api/brain/share", async (req, res) => {
    
    const share = req.body.share;
     
    const userId = req.userId;
    if(share) {
        const link = await LinkModel.findOne({
            userId
        })

        if(link) {
            res.json({
                hash : link
            })
        }
        else {
            const hash = GenerateHash(20)
            await LinkModel.create({
                userId,
                hash
            })
        }

    }
    else {
        await LinkModel.deleteOne({
            userId
        })
        res.json({
            message: "Sharing off"
        })
    }
})



app.listen(3000, () => {
    console.log("helo");
});