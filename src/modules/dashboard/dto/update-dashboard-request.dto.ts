import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDashboardRequestDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsNotEmpty()
    @IsString()
    contents: string;
}