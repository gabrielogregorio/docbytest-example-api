import express, { Application } from 'express';
import getAllTest from 'docbytest';

export const app: Application = express();
app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/docs', (_req, res) => res.json(getAllTest()));
