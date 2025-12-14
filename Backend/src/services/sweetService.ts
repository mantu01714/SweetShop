import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sweetService = {
  async getAllSweets() {
    return prisma.sweet.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async searchSweets(name?: string, category?: string, minPrice?: number, maxPrice?: number) {
    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    return prisma.sweet.findMany({ where, orderBy: { createdAt: 'desc' } });
  },

  async createSweet(data: { name: string; category: string; price: number; quantity: number; description?: string }) {
    return prisma.sweet.create({ data });
  },

  async updateSweet(id: string, data: any) {
    return prisma.sweet.update({ where: { id }, data });
  },

  async deleteSweet(id: string) {
    await prisma.sweet.delete({ where: { id } });
  },

  async purchaseSweet(id: string) {
    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) throw new Error('Sweet not found');
    if (sweet.quantity <= 0) throw new Error('Sweet is out of stock');
    
    return prisma.sweet.update({
      where: { id },
      data: { quantity: sweet.quantity - 1 }
    });
  },

  async restockSweet(id: string, quantity: number) {
    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) throw new Error('Sweet not found');
    
    return prisma.sweet.update({
      where: { id },
      data: { quantity: sweet.quantity + quantity }
    });
  }
};