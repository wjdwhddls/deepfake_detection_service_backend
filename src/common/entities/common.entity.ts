import { PrimaryGeneratedColumn } from "typeorm";

export abstract class CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;
}