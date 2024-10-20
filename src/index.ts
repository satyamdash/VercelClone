// src/index.ts
import express from 'express';
import cors from 'cors';
import { generate } from "./utils";
import Simpler from 'simple-git';
import path from 'path';
import {getAllFiles} from './file';
import {uploadFile} from './aws';
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/deploy', async(req, res) => {
    const repourl=req.body.repourl;
    const id=generate();
    await Simpler().clone(repourl,path.join(__dirname,`output/${id}`));
    const files=getAllFiles(path.join(__dirname,`output/${id}`));
    res.json({
        id: id
    })

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
