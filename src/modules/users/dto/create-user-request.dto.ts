import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../entities/user-role.enum";

export class CreateUserRequestDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    @Matches(/^[가-힣]+$/, { message: 'Username is invalid' })
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak', }) 
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}