import { createWorker } from 'tesseract.js';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import { upload } from './utils/multer';
import fs from 'fs';

import usersRoute from './routes/api/users';
import authRoute from './routes/api/auth';
import connect from './utils/connect';

const app = express();
const port = process.env['PORT'] || 4000;

app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);

interface customTesseractWorker extends Tesseract.Worker {
    getPDF?(title: string): Promise<any>;
}

const worker: customTesseractWorker = createWorker({
    logger: (m) => console.log(m),
});

app.post('/upload', upload, (req: Request, res: Response) => {
    const { lang }: { lang: string } = req.body;
    if (!lang) {
        res.status(400).send('Language is required !');
    }
    if (lang.trim() === '') {
        res.status(400).send('Invalid request');
    }

    try {
        (async () => {
            try {
                if (lang) {
                    console.log(lang);
                    await worker.loadLanguage(lang.trim());
                    await worker.initialize(lang.trim());
                } else {
                    throw new Error('Language is required !');
                }
            } catch (err) {
                res.status(400).send('Language Required');
            }

            try {
                const {
                    data: { text },
                } = await worker.recognize(
                    path.join(
                        __dirname,
                        'uploads',
                        req.file?.filename as string
                    )
                );
                console.log(text);
                if (text) {
                    res.send(text);
                }
            } catch (err) {
                res.status(400).send('Image is required!');
            }

            if (worker.getPDF) {
                const { data } = await worker.getPDF('Tesseract OCR Result');
                fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(data));
            }
        })();
    } catch (err) {
        console.log('Unable to upload to the server');
        res.status(500).send('Unable to upload to the server');
    }
});

app.post('/usingLink', (req: Request, res: Response) => {
    const { lang, imgLink }: { lang: string; imgLink: string } = req.body;

    if (!lang || !imgLink) {
        res.status(400).send('Both Language and Image link are required !');
    }
    if (lang.trim() === '' || imgLink.trim() === '') {
        res.status(400).send('Invalid request');
    }

    try {
        (async () => {
            try {
                if (lang) {
                    await worker.loadLanguage(lang.trim());
                    await worker.initialize(lang.trim());
                } else {
                    throw new Error('Language is required !');
                }
            } catch (err) {
                res.send(400).send('Language Required');
            }

            try {
                const {
                    data: { text },
                } = await worker.recognize(imgLink);
                console.log(text);
                res.send(text);
            } catch (err) {
                console.log('Image not found');
            }

            if (worker.getPDF) {
                const { data } = await worker.getPDF('Tesseract OCR Result');
                fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(data));
            }
        })();
    } catch (err) {
        console.log('Unable to upload to the server');
        res.status(500).send('Unable to upload to the server');
    }
});

app.get('/download', (_req: Request, res: Response) => {
    res.download(path.join(__dirname, '../tesseract-ocr-result.pdf'));
});

app.get('*', (_req: Request, res: Response) => {
    console.log('Invalid route');
    res.send(400).send('Bad Request!');
});
app.listen(port, async () => {
    console.log(`App started on port ${port}`);
    await connect();
    await worker.load();
});
