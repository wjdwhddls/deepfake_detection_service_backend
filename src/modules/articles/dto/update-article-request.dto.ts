import { IsNotEmpty, IsString } from "class-validator";

export class UpdateArticleRequestDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsNotEmpty()
    @IsString()
    contents: string;
}