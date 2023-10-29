import express from 'express';
const router = express.Router();

import { uploadFile , downloadFile , deleteFile } from "../controllers/file-handling.js";


router.post('/upload-file', uploadFile);

router.post('/download-file', downloadFile);

router.post('/delete-file', deleteFile);


export default router;