/* eslint-disable no-underscore-dangle */
import supertest from 'supertest';
import { app } from '../app';

const mockTests: any = {};
const connection: any = null;

const request = supertest(app);
let token = { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5c' };
let idUser = '';
let codeGenerate = '';

const sugestion = {
  _id: '',
  post_id: '6158689924fd4f9e1c587851',
  email: 'gab@gab.com',
  description: 'Eu acho que seria...',
  status: '',
};

let suggestionId = '629cfd7adc5df3a582ff57c6';

beforeAll(async () => {
  const res = await request.post('/generate_code').send({ GENERATOR_CODE: process.env.GENERATOR_CODE });

  codeGenerate = res.body.code;

  const res2 = await request
    .post('/user')
    .send({ username: mockTests.username3, password: mockTests.password3, code: codeGenerate });

  idUser = res2.body._id;

  const res3 = await request.post('/auth').send({ username: mockTests.username3, password: mockTests.password3 });

  // @ts-ignore
  token = { authorization: `Bearer ${res3.body.token}` };
});

afterAll(async () => {
  await request.delete(`/user/${idUser}`);
  await connection.connection.close();
});

describe('🙋 Sugestões', () => {
  test('[doc]: Enviar uma sugestão', async () => {
    const res = await request.post('/suggestion').send({
      post_id: '6158689924fd4f9e1c587851',
      email: 'gab@gab.com',
      description: 'Eu acho que seria...',
    });

    expect(res.body.post_id).toBeDefined();
    expect(res.body._id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();

    const data = {
      body: {
        ...res.body,
        post_id: '6158689924fd4f9e1c587851',
        _id: '62a6a19ff002eb4d4b33fdfe',
        createdAt: '2022-06-13T02:31:59.098Z',
        updatedAt: '2022-06-13T02:31:59.098Z',
      },
    };

    expect(data.body).toEqual({
      post_id: '6158689924fd4f9e1c587851',
      email: 'gab@gab.com',
      description: 'Eu acho que seria...',
      _id: '62a6a19ff002eb4d4b33fdfe',
      createdAt: '2022-06-13T02:31:59.098Z',
      updatedAt: '2022-06-13T02:31:59.098Z',
      __v: 0,
    });

    expect(res.statusCode).toEqual(200);
    sugestion._id = res.body._id;
  });

  test('[doc]: 🚫 Impede o registro de uma sugestão sem conteúdo correto', async () => {
    const res = await request.post('/suggestion').send({
      post_id: '12345123145',
      email: 'gab@gab.com',
      description: '',
    });

    expect(res.body).toEqual({ erro: 'Parametros inválidos ou faltantes' });
    expect(res.statusCode).toEqual(400);
  });

  test('🚫 Deve retornar 400 quando não passar parâmetros', async () => {
    const res = await request.post('/suggestion').send();

    expect(res.body).toEqual({ erro: 'Parametros inválidos ou faltantes' });
    expect(res.statusCode).toEqual(400);
  });

  test('[doc]: Retorna sugestões', async () => {
    const res = await request.get('/suggestions').set(token);

    const data = {
      body: [
        { ...res.body[0], id: '62a6a2074a7b7b6cdc38300a' },
        { ...res.body[1], id: '62a6a26f15ca75769162bd92' },
      ],
    };

    expect(data.body).toEqual([
      {
        description: 'Eu acho que seria...',
        email: 'gab@gab.com',
        id: '62a6a2074a7b7b6cdc38300a',
      },
      {
        description: 'Eu acho que seria...',
        email: 'gab@gab.com',
        id: '62a6a26f15ca75769162bd92',
      },
    ]);

    expect(res.statusCode).toEqual(200);
    expect(res.body[res.body.length - 1].description).toEqual(sugestion.description);
  });

  test('[doc]: 🚫 Impede que um usuários não autorizado vejam as sugestões', async () => {
    const res = await request.get('/suggestions');
    expect(res.body).toEqual({});
    expect(res.statusCode).toEqual(403);
  });

  test('[doc]: Altera o status para aceito', async () => {
    suggestionId = sugestion._id;
    const res = await request.put(`/suggestion/${suggestionId}`).set(token).send({ status: 'accepted' });

    expect(res.body._id).toBeDefined();
    expect(res.body.post_id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();

    const data = {
      body: {
        ...res.body,
        _id: '62a6a313dc62b56d992afd47',
        post_id: '6158689924fd4f9e1c587851',
        createdAt: '2022-06-13T02:38:11.170Z',
        updatedAt: '2022-06-13T02:38:11.204Z',
      },
    };

    expect(data.body).toEqual({
      _id: '62a6a313dc62b56d992afd47',
      post_id: '6158689924fd4f9e1c587851',
      email: 'gab@gab.com',
      description: 'Eu acho que seria...',
      createdAt: '2022-06-13T02:38:11.170Z',
      updatedAt: '2022-06-13T02:38:11.204Z',
      __v: 0,
      status: 'accepted',
    });

    expect(res.statusCode).toEqual(200);
  });

  test('[doc]: Altera o status para rejeitado', async () => {
    suggestionId = sugestion._id;
    const res = await request.put(`/suggestion/${suggestionId}`).set(token).send({ status: 'rejected' });

    expect(res.body._id).toBeDefined();
    expect(res.body.post_id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();

    const data = {
      body: {
        ...res.body,
        _id: '62a6a37e3b7a5abccb60bd95',
        post_id: '6158689924fd4f9e1c587851',
        createdAt: '2022-06-13T02:39:58.270Z',
        updatedAt: '2022-06-13T02:39:58.380Z',
      },
    };

    expect(res.statusCode).toEqual(200);
    expect(data.body).toEqual({
      _id: '62a6a37e3b7a5abccb60bd95',
      post_id: '6158689924fd4f9e1c587851',
      email: 'gab@gab.com',
      description: 'Eu acho que seria...',
      createdAt: '2022-06-13T02:39:58.270Z',
      updatedAt: '2022-06-13T02:39:58.380Z',
      __v: 0,
      status: 'rejected',
    });
  });

  test('[doc]: 🚫 Impedir atualização de status sem o token', async () => {
    suggestionId = sugestion._id;
    const res = await request.put(`/suggestion/${suggestionId}`).send({ status: 'accepted' });

    expect(res.body).toEqual({});
    expect(res.statusCode).toEqual(403);
  });

  test('[doc]: 🚫 Impede alteração por um status inexistente', async () => {
    suggestionId = sugestion._id;
    const res = await request.put(`/suggestion/${suggestionId}`).set(token).send({ status: 'any' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: 'Status para a sugestão inválido!' });
  });

  test('[doc]: Deleta uma sugestão', async () => {
    suggestionId = sugestion._id;
    const res = await request.delete(`/suggestion/${suggestionId}`).set(token);

    expect(res.body).toEqual({});
    expect(res.statusCode).toEqual(200);
  });

  test('[doc]: 🚫 Impede a exclusão de uma sugestão por um desconhecido', async () => {
    suggestionId = sugestion._id;
    const res = await request.delete(`/suggestion/${suggestionId}`);

    expect(res.body).toEqual({});
    expect(res.statusCode).toEqual(403);
  });
});
