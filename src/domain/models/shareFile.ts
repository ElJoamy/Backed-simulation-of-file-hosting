import { FileEntity } from "../../infrastructure/entities/fileEntity";
import { RoleEntity } from "../../infrastructure/entities/roleEntity";
import { SharedFileEntity } from "../../infrastructure/entities/sharedFileEntity";
import { UserEntity } from "../../infrastructure/entities/userEntity";

export class ShareFile{
    id: number;
    file_id: FileEntity;
    user_id: UserEntity;
    role_name: RoleEntity;

    constructor(shareFileEntity: Partial<SharedFileEntity>){
        this.id = shareFileEntity.id;
        this.file_id = shareFileEntity.file;
        this.user_id = shareFileEntity.user;
        this.role_name = shareFileEntity.role;
    }
}