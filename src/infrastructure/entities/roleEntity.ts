import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IRoleEntity } from "../../domain/entities/IRoleEntity";
import { SharedFileEntity } from "./sharedFileEntity";

@Entity()
export class RoleEntity implements IRoleEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @OneToMany(() => SharedFileEntity, sharedFile => sharedFile.role)
    sharedFiles: SharedFileEntity[];

}