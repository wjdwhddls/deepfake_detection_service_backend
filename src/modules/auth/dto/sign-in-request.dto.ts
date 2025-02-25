import { IsNotEmpty, MaxLength } from "class-validator";

export class SignInRequestDto {
    @IsNotEmpty()
    @MaxLength(30)
    user_id: string;

    @IsNotEmpty()
    @MaxLength(30)
    user_pw: string;   
}