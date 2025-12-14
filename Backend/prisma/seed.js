"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Create admin user
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@sweetshop.com' },
        update: {},
        create: {
            email: 'admin@sweetshop.com',
            password: adminPassword,
            name: 'Sweet Shop Admin',
            role: 'ADMIN',
        },
    });
    // Create regular user
    const userPassword = await bcryptjs_1.default.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@sweetshop.com' },
        update: {},
        create: {
            email: 'user@sweetshop.com',
            password: userPassword,
            name: 'Sweet Shop User',
            role: 'USER',
        },
    });
    // Create sample sweets
    const sweets = [
        {
            name: 'Belgian Dark Chocolate',
            category: 'CHOCOLATE',
            price: 8.99,
            quantity: 25,
            description: 'Rich and creamy dark chocolate imported from Belgium',
        },
        {
            name: 'Rainbow Gummy Bears',
            category: 'GUMMY',
            price: 4.99,
            quantity: 50,
            description: 'Colorful assorted gummy bears in six fruity flavors',
        },
        {
            name: 'Strawberry Swirl Lollipop',
            category: 'LOLLIPOP',
            price: 2.49,
            quantity: 100,
            description: 'Classic strawberry flavored swirl lollipop',
        },
        {
            name: 'Vanilla Dream Cookie',
            category: 'COOKIE',
            price: 3.99,
            quantity: 0,
            description: 'Soft-baked vanilla cookies with white chocolate chips',
        },
    ];
    for (const sweet of sweets) {
        await prisma.sweet.upsert({
            where: { name: sweet.name },
            update: {},
            create: sweet,
        });
    }
    console.log('Database seeded successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map