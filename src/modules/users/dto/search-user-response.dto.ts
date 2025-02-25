import { User } from "../entities/user.entity";  

export class SearchUserResponseDto {  
    username: string;  
    user_id: string; // 이메일 추가  
    resetPasswordMessage?: string; // 비밀번호 재설정 메시지  

    constructor(user: User, resetPasswordMessage?: string) {  
        this.username = user.username;  
        this.user_id = user.user_id; // 이메일 값 설정  
        this.resetPasswordMessage = resetPasswordMessage; // 비밀번호 재설정 메시지 설정  
    }  
}  