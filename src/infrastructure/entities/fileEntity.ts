import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { IFileEntity } from "../../domain/entities/IFileEntity";
import { UserEntity } from "./userEntity";
@Entity()
export class FileEntity implements IFileEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'boolean' })
    is_directory!: boolean;

    @Column({ type: 'varchar'})
    path!: string;

    @Column({ type: 'bigint'})
    version!: number;
    
    @Column({ type: 'timestamp', nullable: true })
    created_at!: Date;

    @Column({ type: 'timestamp', nullable: true })
    last_modified!: Date;

    @Column({ type: 'boolean' })
    is_shared!: boolean;

    @Column({ type: 'varchar' })
    type!: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user_id!: UserEntity; //change to userEntity

    @ManyToOne(() => (FileEntity || UserEntity), { onDelete: 'CASCADE', nullable: true})
    @JoinColumn({ name: 'directory_id' })
    directory_id!: FileEntity | null; //  //change to userEntity || fileEntity
}
