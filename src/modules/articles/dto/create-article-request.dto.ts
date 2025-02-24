import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleRequestDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}