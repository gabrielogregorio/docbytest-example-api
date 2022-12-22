import supertest from 'supertest';
import { app } from '../app';

const mockTests: any = {};
const connection: any = null;

const request = supertest(app);
let codeGenerate = '';
let idUser = '';
let token = { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5c' };
let postId = '213';

const post = {
  title: 'Titulo de um post maluco',
  description: 'Descrição maluca',
  user: '',
  tags: {
    moment: 'ComeçoPartida',
    difficult: 'hard',
    ability: 'Spot',
    side: 'Atacantes',
    map: 'Ascent',
    mapPosition: 'heaven',
    agent: 'Sova',
  },
  imgs: [
    {
      id: '1',
      description: 'Primeiro mire no pontinho roxo indicado',
      img: 'img/pontinho.png',
    },
    {
      id: '2',
      description: 'Depois solte a flexa com 1.5 de força',
      img: 'img/pontinho2.png',
    },
  ],
};

const postEdited = {
  title: 'Titulo de um post maluco Editado',
  description: 'Descrição maluca 2',
  user: '',
  tags: {
    moment: 'ComeçoPartida',
    difficult: 'Facil',
    ability: 'Spot',
    side: 'Atacantes',
    map: 'Ascent',
    mapPosition: 'heaven',
    agent: 'Sova',
  },
  imgs: [
    {
      id: '1',
      description: 'Primeiro mire no pontinho roxo indicado',
      img: 'img/pontinho.png',
    },
    {
      id: '2',
      description: 'Depois solte a flexa com 1.5 de força',
      img: 'img/pontinho2.png',
    },
  ],
};

beforeAll(async () => {
  const res = await request.post('/generate_code').send({ GENERATOR_CODE: process.env.GENERATOR_CODE });

  codeGenerate = res.body.code;

  const res2 = await request
    .post('/user')
    .send({ username: mockTests.username2, password: mockTests.password2, code: codeGenerate });

  idUser = res2.body.id;
  post.user = idUser;
  postEdited.user = idUser;

  const res3 = await request.post('/auth').send({ username: mockTests.username2, password: mockTests.password2 });

  // @ts-ignore
  token = { authorization: `Bearer ${res3.body.token}` };
});

afterAll(async () => {
  await request.delete(`/user`).set(token);
  await connection.connection.close();
});

describe('📔 Posts', () => {
  it('[doc] - Cria um post', async () => {
    const res = await request.post('/post').set(token).send(post);

    expect(res.statusCode).toEqual(200);
    postId = res.body.id;

    const data = {
      body: {
        ...res.body,
        id: '62a69cdfca40ab321c86b1da',
      },
    };

    expect(data.body).toMatchObject({
      id: '62a69cdfca40ab321c86b1da',
      title: 'Titulo de um post maluco',
      description: 'Descrição maluca',
      user: {},
      tags: {
        moment: 'ComeçoPartida',
        difficult: 'hard',
        ability: 'Spot',
        side: 'Atacantes',
        map: 'Ascent',
        mapPosition: 'heaven',
        agent: 'Sova',
      },
      imgs: [
        { description: 'Primeiro mire no pontinho roxo indicado' },
        { description: 'Depois solte a flexa com 1.5 de força' },
      ],
    });
  });

  it('[doc] - 🚫 Deve impedir um cadastro de um post por alguém não cadastrado', async () => {
    const res = await request.post('/post').send(post);
    expect(res.body).toEqual({});
    expect(res.statusCode).toEqual(403);
  });

  it('[doc] - 🚫 Impede o cadastro sem informar os dados corretos', async () => {
    const res = await request.post('/post').set(token).send({});
    expect(res.body).toEqual({ error: 'Some value is invalid' });
    expect(res.statusCode).toEqual(400);
  });

  it('[doc] - Edita um post', async () => {
    const res = await request.put(`/post/${postId}`).set(token).send(postEdited);
    expect(res.statusCode).toEqual(200);

    expect(res.body.id).toBeDefined();
    const data = {
      body: {
        ...res.body,
        id: '62a69df069bb129aa45acd13',
      },
    };
    expect(data.body).toEqual({
      id: '62a69df069bb129aa45acd13',
      title: 'Titulo de um post maluco Editado',
      description: 'Descrição maluca 2',
      user: {},
      tags: {
        moment: 'ComeçoPartida',
        difficult: 'Facil',
        ability: 'Spot',
        side: 'Atacantes',
        map: 'Ascent',
        mapPosition: 'heaven',
        agent: 'Sova',
      },
      imgs: [
        { id: '1', description: 'Primeiro mire no pontinho roxo indicado' },
        { id: '2', description: 'Depois solte a flexa com 1.5 de força' },
      ],
    });
  });

  it('Deve Obter um post Editado', async () => {
    const res = await request.get(`/post/${postId}`).set(token);

    const data = {
      body: {
        ...res.body,
        id: '62a69e43222dc79c5f0f23a6',
      },
    };

    expect(res.statusCode).toEqual(200);
    expect(data.body).toEqual({
      id: '62a69e43222dc79c5f0f23a6',
      title: 'Titulo de um post maluco Editado',
      description: 'Descrição maluca 2',
      user: { username: 'userTest' },
      tags: {
        moment: 'ComeçoPartida',
        difficult: 'Facil',
        ability: 'Spot',
        side: 'Atacantes',
        map: 'Ascent',
        mapPosition: 'heaven',
        agent: 'Sova',
      },
      imgs: [
        { id: '1', description: 'Primeiro mire no pontinho roxo indicado' },
        { id: '2', description: 'Depois solte a flexa com 1.5 de força' },
      ],
    });
  });

  it('[doc] - Retorna todos posts', async () => {
    const res = await request.get(`/posts`);
    const data = {
      body: {
        ...res.body,
        posts: [{ ...res.body.posts[0], id: '62a69e76136cbb70bab55e10' }],
      },
    };
    expect(data.body).toEqual({
      posts: [
        {
          id: '62a69e76136cbb70bab55e10',
          title: 'Titulo de um post maluco Editado',
          description: 'Descrição maluca 2',
          user: {
            username: 'userTest',
          },
          tags: {
            ability: 'Spot',
            agent: 'Sova',
            difficult: 'Facil',
            map: 'Ascent',
            mapPosition: 'heaven',
            moment: 'ComeçoPartida',
            side: 'Atacantes',
          },
          imgs: [
            {
              description: 'Primeiro mire no pontinho roxo indicado',
              id: '1',
            },
            {
              description: 'Depois solte a flexa com 1.5 de força',
              id: '2',
            },
          ],
        },
      ],
    });

    expect(res.statusCode).toEqual(200);
  });

  it('[doc] - Deleta um post', async () => {
    const res = await request.delete(`/post/${postId}`).set(token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({});
  });
});
