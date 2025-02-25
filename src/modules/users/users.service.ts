import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { SearchUserResponseDto } from './dto/search-user-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // CREATE
    async createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
        this.logger.verbose(`방문자가 새 계정을 생성하고 있습니다: ${createUserRequestDto.user_id}`);

        const { username, user_pw, user_id, gender, tel, role } = createUserRequestDto;
        if (!username || !user_pw || !user_id || !gender || !tel || !role) {
            throw new BadRequestException('입력된 정보가 올바르지 않습니다.');
        }

        await this.checkEmailExist(user_id);

        const hashedPassword = await this.hashPassword(user_pw);

        const newUser = this.userRepository.create({
            username,
            user_pw: hashedPassword,
            user_id,
            gender,
            tel,
            role,
        });

        const createdUser = await this.userRepository.save(newUser);

        this.logger.verbose(`${createdUser.username}님 환영합니다.`);
        return createdUser;
    }

    // READ - by user_id
    async findUserByEmail(user_id: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { user_id } });
        if (!existingUser) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }
        return existingUser;
    }

    // RESET PASSWORD  
    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<SearchUserResponseDto> {
        const { username, user_id, new_password } = resetPasswordDto;

        const existingUser = await this.userRepository.findOne({ where: { user_id, username } });
        if (!existingUser) {
            throw new NotFoundException('입력하신 닉네임 혹은 이메일로 등록되어 있는 비밀번호를 찾을 수 없습니다.');
        }

        const hashedPassword = await this.hashPassword(new_password);
        existingUser.user_pw = hashedPassword;

        await this.userRepository.save(existingUser);

        return new SearchUserResponseDto(existingUser, '비밀번호가 재설정되었습니다.');
    }

    // Existing Checker
    async checkEmailExist(user_id: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { user_id } });
        if (existingUser) {
            throw new ConflictException('이미 존재하는 이메일입니다.');
        }
    }

    // Hashing Password
    async hashPassword(user_pw: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(user_pw, salt);
    }
}