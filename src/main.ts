import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';  // Fixed import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());
  app.use(cors());  // Now works correctly
  
  await app.listen(3001);
  console.log(`Application running on ${await app.getUrl()}`);
}
bootstrap();