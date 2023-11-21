import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { FileEntity } from './fileEntity'
  import { UserEntity } from './userEntity'; 
import { Role } from '../../domain/models/role';
import { RoleEntity } from './roleEntity';
  
  @Entity()
  export class SharedFileEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => FileEntity, file => file.sharedFiles, {onDelete: "CASCADE"})
    file: FileEntity;
  
    @ManyToOne(() => UserEntity, user => user.sharedFiles, {onDelete: "CASCADE"})
    user: UserEntity;
  
    @ManyToOne(() => RoleEntity, role => role.sharedFiles, {onDelete: "CASCADE"})
    role: RoleEntity;
  }
  