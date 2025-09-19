import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Cookie Parser
  app.use(cookieParser())

  // CORS
   app.enableCors({
      origin: ["http://localhost:3000"],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });

    // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Job Search API')
    .setDescription('API for managing job search automation')
    .setVersion('1.0')
    .addTag('jobs', 'Job management endpoints')
    .addTag('users', 'User management endpoints')
    .addBearerAuth() // If you're using JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth token after refresh
    },
  });

    await app.listen(process.env.PORT ?? 3001);
  }
bootstrap();
