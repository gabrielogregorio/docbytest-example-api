/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv';
import supertest from 'supertest';
import { app } from '../app';

dotenv.config();

const connection: any = () => null;

const request = supertest(app);

let token = { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5c' };
let codeGenerate = 'código enviado pelos devs';

let newUser = {
  code: 'código enviado pelos devs',
  username: 'teste.mariana',
  password: 'teste.password',
};

afterAll(async () => {
  await connection.connection.close();
});

beforeAll(async () => {
  const res = await request.post('/generate_code').send({ GENERATOR_CODE: process.env.GENERATOR_CODE });

  codeGenerate = res.body.code;
  newUser = { ...newUser, code: codeGenerate };
  await request.post('/generate_code').send({ GENERATOR_CODE: process.env.GENERATOR_CODE });
});

describe('[1] 🔐 Autenticação', () => {
  /* doc: O cadastro de usuário precisa ser solicitada aos desenvolvedores */

  it('✅ Cadastrar um usuário', async () => {
    const response = await request.post('/user').send(newUser);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ username: 'teste.mariana' });
  });

  it('[doc]: ✅ realiza login e obtém um token jwt', async () => {
    const response = await request.post('/auth').send({
      username: 'teste.mariana',
      password: 'teste.password',
    });

    expect(response.body.token).toBeDefined();
    expect(response.body.id).toBeDefined();

    const dataMock = {
      body: {
        ...response.body,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        id: '62a69b0137322c68b8c6b111',
      },
    };

    expect(response.statusCode).toEqual(200);
    expect(dataMock.body).toEqual({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      id: '62a69b0137322c68b8c6b111',
    });
    // @ts-ignore
    token = { authorization: `Bearer ${response.body.token}` };
  });

  it('[doc]: 🚫 impede o login de usuário não cadastrado', async () => {
    const response = await request.post('/auth').send({
      username: 'test',
      password: 'test',
    });

    expect(response.body).toEqual({});
    expect(response.statusCode).toEqual(404);
  });

  it('[doc]: 🚫 impede o login com senha inválida', async () => {
    const response = await request.post('/auth').send({
      username: 'teste.mariana',
      password: '123',
    });
    expect(response.body).toEqual({});
    expect(response.statusCode).toEqual(403);
  });

  it('[doc]: ⚠️ deletar a própria conta', async () => {
    const response = await request.delete(`/user`).set(token);

    expect(response.body).toEqual({});
    expect(response.statusCode).toEqual(200);
  });
});
