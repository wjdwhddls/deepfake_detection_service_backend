import { Column, Entity, ManyToOne } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/modules/users/entities/user.entity";
import { CommonEntity } from "src/common/entities/common.entity";

@Entity()
export class Article extends CommonEntity {
    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: ArticleStatus

    @ManyToOne(Type => User, user => user.articles, { eager: false })
    user: User;
}