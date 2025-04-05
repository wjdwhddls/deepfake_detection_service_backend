import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { CommonEntity } from "src/common/entities/common.entity";

@Entity()
export class Dashboard extends CommonEntity {
    @PrimaryGeneratedColumn()
    POST_ID: number;

    @Column({ name: 'USER_ID' })
    USER_ID: number;

    @Column({ length: 255 })
    TITLE: string;

    @Column({ type: 'text' })
    TEXT: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    DATE: Date;

    @Column({ nullable: true })
    LIKE_NUM: number;

    @ManyToOne(() => User, (user) => user.dashboard, { eager: false })
    user: User;
}
