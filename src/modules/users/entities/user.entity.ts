import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "./user-role.enum";
import { Dashboard } from "src/modules/dashboard/entities/dashboard.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { UserGender } from "./user-gender.enum";

@Entity()
export class User extends CommonEntity {
    @Column({ unique: true })
    user_id: string;

    @Column()
    user_pw: string;

    @Column()
    username: string;

    @Column()
    gender: UserGender;

    @Column({ nullable: true })
    tel: string;

    @Column()
    role: UserRole;

    @OneToMany(Type => Dashboard, dashboard => dashboard.USER_ID, { eager: false })
    dashboard: Dashboard[];
    static tel: string | null;
}