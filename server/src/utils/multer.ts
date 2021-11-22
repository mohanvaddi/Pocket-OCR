import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, './../uploads'));
    },
    filename: (_req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // cb(null, `${file.originalname}-${uniqueSuffix}`);

        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage }).single('file');

export { upload };
