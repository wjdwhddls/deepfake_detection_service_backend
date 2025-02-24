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
        this.logger.verbose(`User with email: ${signInRequestDto.email} is signing in`);

        const { email, password } = signInRequestDto;

        try {
            const existingUser = await this.userService.findUserByEmail(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // [1] JWT 토큰 생성
            const payload = {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
            };
            const accessToken = await this.jwtService.sign(payload);

            this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);
            return accessToken;
        } catch (error) {
            this.logger.error(`Invalid credentials or Internal Server error`);
            throw error;
        }
    }
}