import express, { Application } from 'express';
import docbytest from 'docbytest';
import path from 'path';
import cors from 'cors';
import { writeFile } from 'fs/promises';
import statusCode from './statusCode';

export const app: Application = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const doctbytestFile = './docbytest.docs.json';

app.get('/docs-json', async (_req, res) => {
  const returnDev = false;
  const docs = await docbytest({
    statusCode,
    returnDev,
  });

  await writeFile(doctbytestFile, JSON.stringify(docs, null, 2), { encoding: 'utf-8' });

  return res.json(docs);
});

app.get('/docs', (_req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/docbytest-ui/build', 'index.html'));
});

app.use('/docs/static', express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/static/')));
app.use(
  '/docs/manifest.json',
  express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/manifest.json')),
);
app.use('/docs/favicon.ico', express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/favicon.ico')));
