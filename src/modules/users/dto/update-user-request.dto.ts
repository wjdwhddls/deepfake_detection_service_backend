import { IsNotEmpty, IsString } from "class-validator";

export class UpdateArticleRequestDto {
    @IsNotEmpty()
    @IsString()
    user_pw: string;
    
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    tel: string;
}