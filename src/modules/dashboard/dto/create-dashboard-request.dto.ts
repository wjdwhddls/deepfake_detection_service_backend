import { IsNotEmpty, IsString } from "class-validator";

export class CreateDashboardRequestDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}