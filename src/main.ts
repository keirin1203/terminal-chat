import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'

const PORT = process.env.SERVER_PORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`App started at http://localhost:${PORT}`)
  });
}
bootstrap();
