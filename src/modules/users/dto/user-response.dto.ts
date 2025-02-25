import { UserRole } from "../entities/user-role.enum";
import { UserGender } from "../entities/user-gender.enum";
import { User } from "../entities/user.entity";

export class UserResponseDto {
    user_id: string;
    user_pw: string;
    username: string;
    gender: UserGender;
    tel: string;
    role: UserRole;

    constructor(user: User) {
        this.user_id = user.user_id;
        this.user_pw = user.user_pw;
        this.username = user.username;
        this.gender = user.gender;
        this.tel = user.tel;
        this.role = user.role;
    }
}