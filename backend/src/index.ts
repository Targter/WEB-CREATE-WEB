import dotenv from "dotenv"
dotenv.config({path:"./.env"})
import express, { text } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { ContentBlock, TextBlock } from "@anthropic-ai/sdk/resources";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

// const anthropic = new Anthropic();
const genAI = new GoogleGenAI({ apiKey: process.env.keyy});
// console.log(genAI)

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://ab-web-create-web.vercel.app'], // allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
    credentials: true // allow cookies
  }));
app.use(express.json())
app.get("/",async(req,res)=>{
    return res.json({message:"working...});
                    });
app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
        
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { 
                            text: `Analyze this project description and determine whether it should use Node.js (backend) or React (frontend). 
                            Only respond with a single word: 'node' or 'react'. 
                            Do not include any other text or explanation.
                            
                            Project description: ${prompt}`
                        }
                    ]
                }
            ]
        });
        console.log("response:==============================================================================================")

        // console.log("long:Response:",response.text)

        // prompt: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        // max_tokens: 200,
        // const answer = (response.text)?.trim().toLowerCase(); 
        const answer = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
    // const answer = (response.content[0] as TextBlock).text; // react or node
    // console.log(response.text)
    console.log("--------------------------------------------------------------------------------------------------------------",response)
    console.log("a--------------------------",answer)

    if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({message: "You cant access this"})
    return;

})

app.post("/chat", async (req, res) => {
    const messages = req.body.messages;
    console.log("get this ",getSystemPrompt())

    const response = await genAI.models.generateContent({
        model:"gemini-2.0-flash",
        contents:[
            {
                role:"user",
                parts:[
                    {
                        text: `${messages}
                            
                            Project description: ${getSystemPrompt()}`
                    }
                ]
                
            }
        ]
    })

    // const response = await anthropic.messages.create({
    //     messages: messages,
    //     model: 'claude-3-5-sonnet-20241022',
    //     max_tokens: 8000,
    //     system: getSystemPrompt()    
    // })

    const answer = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // const answer = (response.content[0] as TextBlock).text; // react or node
    // console.log(response.text)
    console.log("a",answer)

    res.json({
        response: answer
    });
})

app.listen(3000);

