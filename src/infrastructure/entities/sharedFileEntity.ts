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
  
    @ManyToOne(() => FileEntity, file => file.sharedFiles)
    file: FileEntity;
  
    @ManyToOne(() => UserEntity, user => user.sharedFiles)
    user: UserEntity;
  
    @ManyToOne(() => RoleEntity, role => role.sharedFiles)
    role: RoleEntity;
  }
  