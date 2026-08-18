import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EncryptInterceptor } from './common/interceptor/encryption';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('edg');
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: '*',
  });
  app.useGlobalInterceptors(new EncryptInterceptor());
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
