import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '@/app.module';

async function main() {
    NestFactory.createApplicationContext(AppModule).then(async (appContext) => {
        const prisma = new PrismaClient();

        return new Promise((resolve) => {
            console.log('No seeding...');
            resolve(void 0);
        })
            .catch(async (error) => {
                console.error('Seeding failed!');
                console.error(error);
                await prisma.$disconnect();
                process.exit(1);
            })
            .finally(async () => {
                appContext.close();
                await prisma.$disconnect();
            });
    });
}

main();
