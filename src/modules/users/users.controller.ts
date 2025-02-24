import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  // CREATE
  @Post('/')
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<ApiResponseDto<void>> {
      this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserRequestDto.email}`);

      const userResponseDto = new UserResponseDto(await this.userService.createUser(createUserRequestDto))

      this.logger.verbose(`New account email with ${userResponseDto.email} created Successfully`);
      return new ApiResponseDto(true, 201, 'User created Successfully');
    }
}