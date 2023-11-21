import { version } from 'os';
import { FileStoragePort } from '../../domain/interfaces/fileStoragePort';
import { File } from '../../domain/models/file';
import { FileDto } from '../dtos/file.dto';
import { UserRepository } from './../../domain/interfaces/userRepository';
import { ICacheService } from '../../domain/interfaces/IRedisCache';
import logger from '../../infrastructure/logger/logger';
import { User } from './../../domain/models/user';
import { IFileEntity } from '../../domain/entities/IFileEntity';
import { ShareFile } from '../../domain/models/shareFile';


export class FileService {
    constructor(private fileStoragePort: FileStoragePort, private userRepository: UserRepository, private redisCacheService: ICacheService){}

    async getFiles(): Promise<FileDto[]> {
        const files = await this.fileStoragePort.findAll();

        const filesResponse: FileDto[] = files.map((file: File) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            path: file.path,
            version: file.version,
            is_directory: file.is_directory,
            is_shared: file.is_shared,
            directory_id: file.directory_id,
            user_id: file.user_id
        }));

        return filesResponse;
    }

    async getFilesbyUserId(userId: string): Promise<FileDto[]> {
        const files = await this.fileStoragePort.findAllbyUserId(userId);
        console.log("🚀 ~ file: fileService.ts:35 ~ FileService ~ getFilesbyUserId ~ userId:", userId)

        const filesResponse: FileDto[] = files.map((file: File) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            path: file.path,
            version: file.version,
            is_directory: file.is_directory,
            is_shared: file.is_shared,
            directory_id: file.directory_id,
            user_id: file.user_id
        }));

        return filesResponse;
    }

    async getFileById(id: string): Promise<FileDto | null> {
        const fileCache = await this.redisCacheService.get(`FILE:${id}`);
        if (fileCache) {
            logger.debug(`FileService: Obteniendo al archivo con ID: ${id} desde la cache`);
            const fileObject = JSON.parse(fileCache);
            return fileObject;
        }

        const fileDB = await this.fileStoragePort.findById(id);
        logger.debug(`FileService: Intentando obtener al archivo con ID: ${id}`);

        if (!fileDB) {
            return null;
        }

        const fileResponse: FileDto = {
            id: fileDB.id,
            name: fileDB.name,
            type: fileDB.type,
            path: fileDB.path,
            version: fileDB.version,
            is_directory: fileDB.is_directory,
            is_shared: fileDB.is_shared,
            directory_id: fileDB.directory_id,
            user_id: fileDB.user_id
        };

        await this.redisCacheService.set(`FILE:${id}`, JSON.stringify(fileResponse));
        return fileResponse;
    }

    async createFile(fileDto: FileDto): Promise<File> {
        const user = await this.userRepository.findById(fileDto.user_id);
        console.log("🚀 ~ file: fileService.ts:64 ~ FileService ~ createFile ~ user:", user)
        const directory = await this.fileStoragePort.findById(fileDto.directory_id);
        console.log("🚀 ~ file: fileService.ts:66 ~ FileService ~ createFile ~ directory:", directory)
        
        if (!user && !directory) {
            throw new Error('Base no encontrada');
        }

        const fileEntity: IFileEntity = {
            name: fileDto.name,
            is_directory: fileDto.is_directory,
            type: fileDto.type,
            version: 1,
            directory_id: directory || null,
            user_id: user,
            created_at: new Date(),
            last_modified: new Date(),
            is_shared: false
        };

        const newFile = new File(fileEntity);
        return this.fileStoragePort.createFile(newFile);
    }

    async deleteFile(fileId: string): Promise<void> {
        logger.info(`FileService: Intentando eliminar al archivo con ID: ${fileId}`);
        await this.fileStoragePort.deleteFile(fileId);
    }

    async updateFile(fileId: string, updateData: Partial<FileDto>): Promise<File> {
        logger.info(`FileService: Intentando actualizar al archivo con ID: ${fileId}`);
        return this.fileStoragePort.updateFile(fileId, updateData);
    }

    async shareFile(fileId: string, userId: string, name: string): Promise<ShareFile> {
        logger.info(`FileService: Intentando compartir el archivo con ID: ${fileId}`);
        const sharedFile = await this.fileStoragePort.shareFile(fileId, userId, name);
        console.log("🚀 ~ file: fileService.ts:123 ~ FileService ~ shareFile ~ sharedFile:", sharedFile)
        return sharedFile;
    }
    

}