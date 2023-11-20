import { IUserEntity } from "./IUserEntity";

export interface IFileEntity {
    id?: string;
    name: string;
    is_directory: boolean;
    path: string;
    version: number;
    user_id: IUserEntity;
    directory_id: IUserEntity | IFileEntity;
    created_at: Date;
    last_modified: Date;
    is_shared: boolean;
    type?: string;
}