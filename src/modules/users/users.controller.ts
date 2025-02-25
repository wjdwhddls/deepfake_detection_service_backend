import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SearchUserResponseDto } from './dto/search-user-response.dto';

@Controller('api/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  // CREATE
  @Post('/')
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto): Promise<ApiResponseDto<void>> {
    this.logger.verbose(`방문자가 새 계정을 생성하고 있습니다: ${createUserRequestDto.user_id}`);

    const userResponseDto = new UserResponseDto(await this.userService.createUser(createUserRequestDto))

    this.logger.verbose(`${userResponseDto.user_id}로 새 계정이 성공적으로 생성되었습니다.`);
    return new ApiResponseDto(true, 201, '사용자가 성공적으로 생성되었습니다.');
  }

  // RESETPASSWORD
  @Post('/:user_id')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<SearchUserResponseDto> {
    return this.userService.resetPassword(resetPasswordDto);
  }
}