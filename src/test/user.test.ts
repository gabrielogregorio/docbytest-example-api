const request: any = {}

describe('Handle Users', () => {
  it('you must register a user', async () => {
    const response = await request.post('/user')
      .send({
        code: '765',
        username: 'code test',
        password: 'code test'
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({
      username: 'code test'
    });
  });

  it('Should return 409 when trying to register a user that already exists', async () => {
    const response = await request.post('/user').send({
      code: 'code invalid',
      username: 'other code',
      password: 'other password'
    });

    expect(response.statusCode).toEqual(409);
    expect(response.body).toMatchObject({ error: 'Username is already registered' });
  });

  it('Must log into the system and get a token', async () => {
    // doc.description: "This is other docs"
    const response = await request.post('/auth').send({
      username: 'new user',
      password: 'new password'
    });

    expect(response.statusCode).toEqual(200);
  });

  it('Should return 404 for an unregistered user trying to log into the systems', async () => {
   // doc.description: "This is other doc"
   const response = await request.post('/auth').send({
     username: "user404",
     password: "user404"
    });

    expect(response.statusCode).toEqual(404);
  });

  it('Should return 403 for a user with an invalid password trying to log into the systems', async () => {
   // doc.description: "This is documentation"
   const userId = 192
   const anyParam = 'sempre'

   const response = await request.post(`/auth/${userId}?dataId=${anyParam}`)
    .send({ username: 'fake username', password: "fake password" })
    .set({Authorization: "Bearer 123"});

   expect(response.statusCode).toEqual(403);
   expect(response.body).toEqual({ message: "This password is invalid!"});
  });

  it('Should prevent a user with invalid token from getting the users', async () => {
    const response = await request.get(`/user`);

    expect(response.statusCode).toEqual(403);
  });

  it('Must Get a User', async () => {
    const response = await request.get(`/user`).set('Bearer');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ username: 'abc' });
  });

  it('Should prevent a user with invalid token from Editing a User', async () => {
    const response = await request.put(`/user`).send({
      username: 'cde',
      password: '456',
    });

    expect(response.statusCode).toEqual(403);
  });

  it('Must Edit a User', async () => {
    const response = await request.put(`/user`).set('Bearer').send({
      username: 'abc',
      password: '123',
    });

    expect(response.body).toEqual({ username: 'testSystemAfk37812-++aks22' });
    expect(response.statusCode).toEqual(200);
  });

  it('Should prevent a user with invalid token from Deleting a user', async () => {
    const response = await request.delete(`/user`);

    expect(response.statusCode).toEqual(403);
  });

  it('Must Delete a User', async () => {
    const response = await request.delete(`/user`).set('Bearer');

    expect(response.statusCode).toEqual(200);
  });
});
