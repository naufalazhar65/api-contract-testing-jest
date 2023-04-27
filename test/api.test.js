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

// ================================================================================================

  describe('GET /users', () => {
    it('should return a list of users with valid properties', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      const { body } = response;
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('per_page');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('total_pages');
      expect(body).toHaveProperty('data');

      const { data } = body;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('email');
      expect(data[0]).toHaveProperty('first_name');
      expect(data[0]).toHaveProperty('last_name');
      expect(data[0]).toHaveProperty('avatar');

      console.log("GET", body);
    });
  });

// ================================================================================================

  describe('POST /users', () => {
    it('should create a new user with valid properties', async () => {
      const response = await request(app)
        .post('/users')
        .send(user)
        .expect(201);

      const { body } = response;
      expect(body).toHaveProperty('name', user.name);
      expect(body).toHaveProperty('job', user.job);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('createdAt');

      console.log("CREATED", body);
    });
  });

// ================================================================================================

  describe('PUT /users/:id', () => {
    it('should update an existing user with valid properties', async () => {
      const createResponse = await request(app)
        .post('/users')
        .send(user)
        .expect(201);

      const updateResponse = await request(app)
        .put(`/users/${createResponse.body.id}`)
        .send({ job: 'zion resident', name: 'morpheus' })
        .expect(200);

      const { body } = updateResponse;
      expect(body).toHaveProperty('name', 'morpheus');
      expect(body).toHaveProperty('job', 'zion resident');
      expect(body).toHaveProperty('updatedAt');

      console.log("EDITED", body);
    });
  });

// ================================================================================================
  
  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      // Create a new user
      const createResponse = await request(app)
        .post('/users')
        .send(user)
        .expect(201);
  
      // Delete the user
      const deleteResponse = await request(app)
        .delete(`/users/${createResponse.body.id}`)
        .expect(204);
  
      // Verify the user has been deleted
      const getResponse = await request(app)
        .get(`/users/${createResponse.body.id}`)
        .expect(404);
  
      console.log(createResponse.body);
      console.log("DELETE", deleteResponse.body);
      console.log(getResponse.body);
    });
  });  
});