import { IFileEntity } from "../entities/IFileEntity";
import { IUserEntity } from "../entities/IUserEntity";

export class File {
    id: string;
    name: string;
    is_directory: boolean;
    path: string;
    version: number;
    user_id: IUserEntity; 
    directory_id: IUserEntity | IFileEntity;// could be de user id or the directory
    created_at: Date;
    last_modified: Date;
    is_shared: boolean;
    type?: string;

    constructor(fileEntity: Partial<IFileEntity>){
        this.id  = fileEntity.id,
        this.name = fileEntity.name,
        this.is_directory = fileEntity.is_directory,
        this.path = fileEntity.path;
        this.version = fileEntity.version,
        this.user_id = fileEntity.user_id,
        this.directory_id = fileEntity.directory_id;
        this.created_at = fileEntity.created_at,
        this.last_modified = fileEntity.last_modified,
        this.is_shared = fileEntity.is_shared,
        this.type = fileEntity.type
    }

}