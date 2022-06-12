import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(9000, () => {
    console.log(`App started at http://localhost:9000`)
  });
}
bootstrap();
