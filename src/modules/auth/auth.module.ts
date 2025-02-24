import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/modules/users/users.module';

dotenv.config();

@Module({  
  imports: [  
      UserModule,  
      PassportModule.register({ defaultStrategy: 'jwt' }),  
      JwtModule.register({  
          secret: process.env.JWT_SECRET,  
          signOptions: {  
              expiresIn: process.env.JWT_EXPIRATION,  
          }  
      }),  
  ],  
  controllers: [AuthController],  
  providers: [AuthService, JwtStrategy],  
  exports: [JwtModule, PassportModule]  
})  
export class AuthModule {}