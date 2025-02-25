import { Body, Controller, Delete, Logger, Param, Post, Put } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { ApiResponseDto } from 'src/common/api-response-dto/api-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SearchUserResponseDto } from './dto/search-user-response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { User } from './entities/user.entity';
import { GetUser } from '../auth/custom-guards-decorators/get-user.decorator';

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

  // Update user by id  
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserRequestDto: UpdateUserRequestDto): Promise<User> {
    return this.userService.updateUser(id, updateUserRequestDto);
  }

  // RESETPASSWORD
  @Post('/:id')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<SearchUserResponseDto> {
    return this.userService.resetPassword(resetPasswordDto);
  }

  // DELETE  
  @Delete('/:id')
  async deleteUser(@Body('id') userId: number): Promise<ApiResponseDto<void>> {
    this.logger.verbose(`사용자가 계정을 삭제하려고 합니다: ${userId}`);

    const result = await this.userService.deleteUser(userId);

    if (result) {
      this.logger.verbose(`ID ${userId}에 해당하는 계정이 성공적으로 삭제되었습니다.`);
      return new ApiResponseDto(true, 200, '사용자가 성공적으로 삭제되었습니다.');
    } else {
      this.logger.warn(`ID ${userId}에 해당하는 계정을 찾을 수 없습니다.`);
      return new ApiResponseDto(false, 404, '사용자가 존재하지 않습니다.');
    }
  }
}