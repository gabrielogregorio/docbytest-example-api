import express, { Application } from 'express';
import docbytest from 'docbytest';
import path from 'path';
import cors from 'cors';

export const app: Application = express();

const docbytestTest = docbytest({
  SUCCESS: {
    code: 200,
    description: 'ok',
  },
  SUCCESS_NO_CONTENT: {
    code: 204,
    description: 'no content',
  },
});

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TO YOURS IMAGE
app.use(express.static('public'));

// TO RETURN DOCBYTEST
app.get('/docs-json', async (_req, res) => {
  const docs = await docbytestTest;
  return res.json(docs);
});

// TO RETURN DOCBYTEST UI
app.use('/docs/', express.static(path.join(__dirname, '../node_modules/docbytest-ui/build/')));
