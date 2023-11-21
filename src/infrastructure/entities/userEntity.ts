import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { IUserEntity } from '../../domain/entities/IUserEntity';
import { RoleEntity } from "./roleEntity";
import { SharedFileEntity } from "./sharedFileEntity";
@Entity()
export class UserEntity implements IUserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    username!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'varchar' })
    passwordHash!: string;

    @Column({ type: 'timestamp' })
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin!: Date;

    @ManyToOne(() => RoleEntity, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'roleId' })
    role: RoleEntity;

    @OneToMany(() => SharedFileEntity, sharedFile => sharedFile.user , {onDelete: "CASCADE"})
    sharedFiles: SharedFileEntity[];
}
