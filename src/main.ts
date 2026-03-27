import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EncryptInterceptor } from './common/interceptor/encryption';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new EncryptInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
