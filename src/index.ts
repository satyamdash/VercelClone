// src/index.ts
import express from 'express';
import cors from 'cors';
import { generate } from "./utils";
import Simpler from 'simple-git';
import path from 'path';
import {getAllFiles} from './file';
import {uploadFile} from './aws';
import {createClient} from "redis";

// Create and connect to Redis client for publishing
const publisher = createClient();
publisher.connect();

// Initialize Express app
const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Define POST route for '/deploy'
app.post('/deploy', async(req, res) => {
    // Extract repository URL from request body
    const repourl = req.body.repourl;
    
    // Generate a unique ID for this deployment
    const id = generate();

    // Clone the repository to a local directory
    await Simpler().clone(repourl, path.join(__dirname, `output/${id}`));
    
    // Getting all files from the cloned repository
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    
    // Sending id to client
    res.json({
        id: id
    })
    //Uploading files to S3
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })
    //Pushing id to redis
    publisher.lPush("deploy", id);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
