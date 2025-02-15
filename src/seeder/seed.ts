import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SeederModule } from './seed.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(SeederModule);
  const seedService = app.get(SeederService);
  await seedService.seed();
  await app.close();
}
bootstrap();
