import { File } from "../models/file";

export interface FileStoragePort{
    findAll(): Promise<File[]>;
    findAllbyUserId(userId: string): Promise<File[]>;
    findById(id: string): Promise<File | null>;
    createFile(file: File): Promise<File>;
    deleteFile(id: string): Promise<void>;
    updateFile(fileId: string, updateData: Partial<File>): Promise<File>;
    findByPath(path: string): Promise<File | null>;
}