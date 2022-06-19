import supertest from 'supertest';
import { app } from '../app';

const statusCode: any = {};
const connection: any = null;

const request = supertest(app);

afterAll(async () => {
  await connection.connection.close();
});

let views = 0;

describe('👀 Visualizações', () => {
  it('[doc]: ✅ Retorna quantidade de visualizações', async () => {
    /* Retorna quantos views a API recebeu */
    const res = await request.get('/views');
    expect(res.body.countAll).toBeDefined();
    expect(res.body.countIps).toBeDefined();

    const data = {
      body: {
        ...res.body,
        countAll: 33,
        countIps: 1,
      },
    };

    expect(res.statusCode).toEqual(200);
    expect(data.body).toEqual({ countAll: 33, countIps: 1 });
    views = res.body.countAll;
  });

  it('[doc]: ✅ Cria nova visualização', async () => {
    /* doc: Essa rota registra a quantidade de visualizações que o site teve, não substituindo claro ferramentas de analytics */
    const res = await request.post('/views').send({});
    expect(res.body).toEqual({ msg: 'ok' });
    expect(res.statusCode).toEqual(200);
  });

  it('✅ Retorna visualizações + 1', async () => {
    const res = await request.get('/views');
    expect(res.statusCode).toEqual(statusCode.SUCCESS.code);
    expect(res.body.countAll).toEqual(views + 1);
  });
});
