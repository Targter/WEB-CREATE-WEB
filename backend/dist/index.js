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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const cors_1 = __importDefault(require("cors"));
const genai_1 = require("@google/genai");
// const anthropic = new Anthropic();
const genAI = new genai_1.GoogleGenAI({ apiKey: process.env.keyy });
// console.log(genAI)
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://ab-web-create-web.vercel.app'], // allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
    credentials: true // allow cookies
}));
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ message: "response working" });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}));
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const prompt = req.body.prompt;
    const response = yield genAI.models.generateContent({
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
    console.log("response:==============================================================================================");
    // console.log("long:Response:",response.text)
    // prompt: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
    // max_tokens: 200,
    // const answer = (response.text)?.trim().toLowerCase(); 
    const answer = (_f = (_e = (_d = (_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.trim().toLowerCase();
    // const answer = (response.content[0] as TextBlock).text; // react or node
    // console.log(response.text)
    console.log("--------------------------------------------------------------------------------------------------------------", response);
    console.log("a--------------------------", answer);
    if (answer == "react") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [react_1.basePrompt]
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [node_1.basePrompt]
        });
        return;
    }
    res.status(403).json({ message: "You cant access this" });
    return;
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const messages = req.body.messages;
    console.log("get this ", (0, prompts_1.getSystemPrompt)());
    const response = yield genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${messages}
                            
                            Project description: ${(0, prompts_1.getSystemPrompt)()}`
                    }
                ]
            }
        ]
    });
    // const response = await anthropic.messages.create({
    //     messages: messages,
    //     model: 'claude-3-5-sonnet-20241022',
    //     max_tokens: 8000,
    //     system: getSystemPrompt()    
    // })
    const answer = (_f = (_e = (_d = (_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.trim();
    // const answer = (response.content[0] as TextBlock).text; // react or node
    // console.log(response.text)
    console.log("a", answer);
    res.json({
        response: answer
    });
}));
app.listen(3000);
