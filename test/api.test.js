const request = require('supertest');
const app = 'https://reqres.in/api';

describe('ReqRes API Contract Tests', () => {
  let user;

  beforeAll(async () => {
    // Set up a user object to use in test cases
    user = {
      name: 'Test User',
      job: 'Test Job'
    };
  });

  describe('GET /users', () => {
    it('should return a list of users with valid properties', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);

      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('per_page');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('total_pages');
      expect(res.body).toHaveProperty('data');

      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('email');
      expect(res.body.data[0]).toHaveProperty('first_name');
      expect(res.body.data[0]).toHaveProperty('last_name');
      expect(res.body.data[0]).toHaveProperty('avatar');

      console.log(res.body); // tambahkan console.log untuk menampilkan respons data
    });
  });

  describe('POST /users', () => {
    it('should create a new user with valid properties', async () => {
      const res = await request(app)
        .post('/users')
        .send(user)
        .expect(201);

      expect(res.body).toHaveProperty('name', user.name);
      expect(res.body).toHaveProperty('job', user.job);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('createdAt');

      console.log(res.body); // tambahkan console.log untuk menampilkan respons data
    });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user with valid properties', async () => {
      // Create a user to update
      const createRes = await request(app)
        .post('/users')
        .send(user)
        .expect(201);
  
      // Update the user
      const updateRes = await request(app)
        .put(`/users/${createRes.body.id}`)
        .send({ job: 'zion resident', name: 'morpheus' })
        .expect(200);
      
      expect(updateRes.body).toHaveProperty('name', 'morpheus');
      expect(updateRes.body).toHaveProperty('job', 'zion resident');
      expect(updateRes.body).toHaveProperty('updatedAt');

      console.log(updateRes.body); // tambahkan console.log untuk menampilkan respons data
    });
  });
  

  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      // Create a new user
      const createRes = await request(app)
        .post('/users')
        .send(user)
        .expect(201);

      // Delete the userr
      const deleteRes = await request(app)
        .delete(`/users/${createRes.body.id}`)
        .expect(204);

      // Verify the user has been deleted
      const getRes = await request(app)
        .get(`/users/${createRes.body.id}`)
        .expect(404);

        console.log(createRes.body); // tambahkan console.log untuk menampilkan respons data
        console.log(deleteRes.body); // tambahkan console.log untuk menampilkan respons data
        console.log(getRes.body); // tambahkan console.log untuk menampilkan respons data
    });
  });
});