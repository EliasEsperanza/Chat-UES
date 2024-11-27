import express from 'express';
import { sendMenssage } from '../controllers/mensaje.controller.js';

const router = express.Router();

router.post('/send/:id', sendMenssage);
router.get('/:id', getMenssage);

export default router;