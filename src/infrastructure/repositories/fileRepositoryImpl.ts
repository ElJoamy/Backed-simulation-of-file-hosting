import { FileStoragePort } from "../../domain/interfaces/fileStoragePort";
import { File } from "../../domain/models/file";
import { AppDataSource } from "../config/dataSource";
import { FileEntity } from "../entities/fileEntity";
import logger from "../logger/logger";
import { UserEntity } from './../entities/userEntity';


export class fileRepositoryImpl implements FileStoragePort {
  async findAllbyUserId(userId: string): Promise<File[]> {
    const fileRepository = AppDataSource.getRepository(FileEntity);
    const files = await fileRepository.find({
      relations: ['user_id']
    });
      files.map((file) => console.log(file.user_id?.id ?? 'unknown'));
    const filteredFiles = files.filter((file) => file.user_id?.id == userId);
    
    return filteredFiles.map((file) => new File(file));
  }

  async findAll(): Promise<File[]> {
    const fileRepository = AppDataSource.getRepository(FileEntity);
    const files = await fileRepository.find();
    return files.map((file) => new File(file));
  }

  async findById(id: string): Promise<File> {
    logger.info("Find File by id");
    const fileRepository = AppDataSource.getRepository(FileEntity);
    const file = await fileRepository.findOne({
      where: { id },
    });
    return file ? new File(file) : null;
  }

  async createFile(file: File): Promise<File> {
    const fileRepository = AppDataSource.getRepository(FileEntity);

        const fileEntity = fileRepository.create({
            name: file.name,
            is_directory: file.is_directory || false,
            type: file.type || "txt",
            path: file.path,
            user_id: file.user_id,
            is_shared: file.is_shared || false,
            directory_id: file.directory_id || null,
            created_at: file.created_at || new Date(),
            last_modified: file.created_at || new Date(),
            version: file.version || 1
        });
        
        const fileResponse = await fileRepository.save(fileEntity);

        return new File({
            id: fileResponse.id,
            name: fileResponse.name,
            is_directory: fileResponse.is_directory,
            path: fileResponse.path,
            version: 1,
            type: fileResponse.type,
            user_id: fileResponse.user_id,
            directory_id: fileResponse.directory_id,
            is_shared: fileResponse.is_shared,
            created_at: fileResponse.created_at,
            last_modified: fileResponse.last_modified
        });
  }

  async deleteFile(id: string): Promise<void> {
    logger.info("Eliminando file en Repository");

    // Buscar el usuario por su ID
    const fileEntity = await AppDataSource.getRepository(FileEntity).findOneBy({
      id: id
    });

    if (fileEntity) {
      // Eliminar el usuario de la base de datos
      await AppDataSource.getRepository(FileEntity).remove(fileEntity);
      logger.info("Usuario eliminado correctamente");
    } else {
      logger.error("Usuario no encontrado para eliminar");
    }
  }

  async updateFile(id: string, updateData: Partial<File>): Promise<File> {
    const repository = AppDataSource.getRepository(FileEntity);
        const file = await repository.findOneBy({ id });

        if (!file) {
            logger.error(`FileRepository: Error al modificar al archivo con ID: ${id}.`);
            throw new Error('Archivo no encontrado');
        }

        repository.merge(file, updateData);
        const updatedFile = await repository.save(file);
        return updatedFile;
  }

  async findByPath(path: string): Promise<File> {
    const fileRepository = AppDataSource.getRepository(FileEntity);
        const file = await fileRepository.findOne({
            where: { path }
        });
        return file ? new File(file) : null;
  }
}
