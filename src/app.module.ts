import { Module, ValidationPipe } from '@nestjs/common';
import { ArticlesModule } from './modules/articles/articles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticlesModule,
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
        provide: APP_PIPE,
        useClass: ValidationPipe,
    },
  ]
})
export class AppModule {}