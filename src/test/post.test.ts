const request: any = {}

describe('must test post registration system', () => {
  it('Should prevent a registration of a post by someone not registered', async () => {
    const res = await request.post('/post').send({
      body: 'body item'
    });

    expect(res.statusCode).toEqual(403);
  });

  it('you must register a post', async () => {
    const res = await request.post('/post').set('Bearer').send({
      body: 'body item'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      username: 'Maria',
      body: 'body item'
    });
  });

  it('it should return 400 for the registration of a post without the data', async () => {
    const res = await request.post('/post').set('Bearer').send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      message: 'do you need passing data posts'
    });
  });

  it('must Edit a Post', async () => {
    const postId = 1925
    const res = await request.put(`/post/${postId}`).set('Bearer').send({
      body: 'body item updated'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('body item updated');
  });

  it('must get a post', async () => {
    const postId = 1925
    const res = await request.get(`/post/${postId}`).set('Bearer');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      username: 'Maria',
      body: 'body item'
    });
  });

  it('must get all posts', async () => {
    const res = await request.get(`/posts`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        username: 'Maria',
        body: 'body item'
      }
    ])
  });

  it('should delete a post', async () => {
    const postId = 1925
    const res = await request.delete(`/post/${postId}`).set('Bearer');

    expect(res.statusCode).toEqual(200);
  });

  it('should prevent a user from deleting another\'s post', async () => {
    const postId = 1925
    const res = await request.delete(`/post/${postId}`).set('Fake Token');

    expect(res.statusCode).toEqual(403);
  });
});
