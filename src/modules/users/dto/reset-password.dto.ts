import { IsEmail, IsNotEmpty } from 'class-validator';  

export class ResetPasswordDto {  
    @IsNotEmpty()  
    username: string;  

    @IsEmail()  
    user_id: string; // 이메일을 user_id로 사용  

    @IsNotEmpty()  
    new_password: string;  

    constructor(username: string, user_id: string, new_password: string) {  
        this.username = username;  
        this.user_id = user_id;  
        this.new_password = new_password;  
    }  
} 