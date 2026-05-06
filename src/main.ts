import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from "express"
import { HttpExceptionFilter } from './common/filters/all-exception';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({   // filterni ishlatib beradi
    whitelist: true, // DTOga mos kelmaydigan malumotlarni olib tashlaydi
    forbidNonWhitelisted: true, // DTOga mos kelmaydigan malumotlarni olib tashlaydi va xatolik beradi
    transform: true,  // DTOga mos kelmaydigan malumotlarni olib tashlaydi va xatolik beradi
  }));

  app.useGlobalFilters(new HttpExceptionFilter()) // global filterni ishlatib beradi

  // Swaggerni ishga tushirish
  const config = new DocumentBuilder()
    .setTitle('Article Project')
    .setDescription('Article description')
    .setVersion('1.0.0')
    .addBasicAuth(
      {
        type: "http",
        scheme: "beared",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT Token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true  // refresh qilganda, token o'chib ketishini olidini oladi
    },
  });

  app.use("/uploads", express.static("uploads"))

  const PORT = process.env.PORT || 3000
  await app.listen(PORT, () => {
    console.log(`Root api for project: http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    console.log(`Google auth: http://localhost:${PORT}/auth/google`);
    console.log(`GitHub auth: http://localhost:${PORT}/auth/github`);
  });
}
bootstrap();
