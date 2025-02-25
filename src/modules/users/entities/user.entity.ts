import { Column, Entity, OneToMany } from "typeorm";
import { UserRole } from "./user-role.enum";
import { Article } from "src/modules/articles/entities/article.entity";
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

    @OneToMany(Type => Article, article => article.author, { eager: false })
    articles: Article[];
}