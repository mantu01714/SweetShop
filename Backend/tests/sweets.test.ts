import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Sweets Endpoints', () => {
  let authToken: string;
  let adminToken: string;

  beforeEach(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create and login regular user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123',
        name: 'Test User'
      });

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });

    authToken = userLogin.body.token;

    // Create admin user
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'hashedpassword',
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });

    adminToken = adminLogin.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/sweets', () => {
    it('should create sweet as an admin', async () => {
      const sweetData = {
        name: 'Test Chocolate',
        category: 'CHOCOLATE',
        price: 5.99,
        quantity: 10,
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.price).toBe(sweetData.price);
    });

    it('should not create sweet as regular user', async () => {
      const sweetData = {
        name: 'Test Chocolate',
        category: 'CHOCOLATE',
        price: 5.99,
        quantity: 10
      };

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sweetData)
        .expect(403);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await prisma.sweet.create({
        data: {
          name: 'Test Sweet',
          category: 'CANDY',
          price: 2.99,
          quantity: 5
        }
      });
    });

    it('should get all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Sweet');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await prisma.sweet.createMany({
        data: [
          { name: 'Chocolate Bar', category: 'CHOCOLATE', price: 3.99, quantity: 10 },
          { name: 'Gummy Bears', category: 'GUMMY', price: 2.99, quantity: 20 },
          { name: 'Expensive Truffle', category: 'CHOCOLATE', price: 15.99, quantity: 5 }
        ]
      });
    });

    it('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Chocolate Bar');
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=CHOCOLATE')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=3&maxPrice=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Chocolate Bar');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Test Sweet',
          category: 'CANDY',
          price: 2.99,
          quantity: 5
        }
      });
      sweetId = sweet.id;
    });

    it('should purchase sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.quantity).toBe(4);
    });

    it('should not purchase out of stock sweet', async () => {
      await prisma.sweet.update({
        where: { id: sweetId },
        data: { quantity: 0 }
      });

      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Test Sweet',
          category: 'CANDY',
          price: 2.99,
          quantity: 5
        }
      });
      sweetId = sweet.id;
    });

    it('should delete sweet as admin', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should not delete sweet as regular user', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });
});