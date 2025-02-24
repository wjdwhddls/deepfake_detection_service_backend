import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response-dto';

@Controller('api/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  // CREATE
  @Post('/')
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<ApiResponseDto<void>> {
      this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserRequestDto.email}`);

      await this.usersService.createUser(createUserRequestDto)

      this.logger.verbose(`New account created Successfully`);
      return new ApiResponseDto(true, HttpStatus.CREATED, 'User created Successfully');
    }
}