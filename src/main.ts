import { NestFactory } from '@nestjs/core';  
import { AppModule } from './app.module';  
import { Logger } from '@nestjs/common';  

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);  

  app.enableCors({  
    origin: 'http://localhost:4200', 
    credentials: true,  
    exposedHeaders: ['Authorization'],
  });  

  // 기본값 설정  
  const port = process.env.PORT ? Number(process.env.PORT) : 3000; // 기본 포트 3000  

  await app.listen(port);  
  Logger.log(`Application Running on Port: ${port}`);  
}  

bootstrap();  