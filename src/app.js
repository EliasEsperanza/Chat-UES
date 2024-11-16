import express from 'express';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));
app.use(express.json());

export default app;