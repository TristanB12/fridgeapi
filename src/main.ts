import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  Sentry.init({
    dsn: "https://6e6a141c1a604b15aa0a9fd782eaa0ad@o4505045827649536.ingest.sentry.io/4505045829943296",
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.info('Listening on ' + PORT);
}
bootstrap();
