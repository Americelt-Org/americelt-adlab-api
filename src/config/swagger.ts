import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

 // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Job Search API')
    .setDescription('API for managing job search automation')
    .setVersion('1.0')
    .addTag('jobs', 'Job management endpoints')
    .addTag('users', 'User management endpoints')
    .addBearerAuth() // If you're using JWT authentication
    .build();

 

function generateSwaggerDoc(app: INestApplication): OpenAPIObject {
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth token after refresh
    },
  });

  return document
}

