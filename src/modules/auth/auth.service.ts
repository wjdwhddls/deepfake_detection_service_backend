import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    // Sign-in
    async signIn(signInRequestDto: SignInRequestDto): Promise<string> {
        this.logger.verbose(`User with email: ${signInRequestDto.user_id} is signing in`);

        const { user_id, user_pw } = signInRequestDto;

        try {
            const existingUser = await this.userService.findUserByEmail(user_id);

            if (!existingUser || !(await bcrypt.compare(user_pw, existingUser.user_pw))) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // [1] JWT 토큰 생성
            const payload = {
                id: existingUser.user_id,
                username: existingUser.username,
                role: existingUser.role,
                gender: existingUser.gender,
                tel: existingUser.tel,
            };
            const accessToken = await this.jwtService.sign(payload);

            this.logger.verbose(`User with email: ${signInRequestDto.user_id} issued JWT ${accessToken}`);
            return accessToken;
        } catch (error) {
            this.logger.error(`Invalid credentials or Internal Server error`);
            throw error;
        }
    }
}