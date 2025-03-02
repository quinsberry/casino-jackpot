import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '@/app.module';
import { AuthService } from '@/modules/auth/auth.service';

async function main() {
    NestFactory.createApplicationContext(AppModule).then(async (appContext) => {
        const prisma = new PrismaClient();


        async function seedUsers() {
            await prisma.player.createMany({
                data: [
                    {
                        name: 'admin',
                        passwordHash: await AuthService.hashPassword('root'),
                    },
                ],
            });
        }

        return seedUsers().then(() => {
            console.log('Seeding successful!');
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
