import { hosting } from "../config/config";
import { FileStoragePort } from "../../domain/interfaces/fileStoragePort";
import { File } from "../../domain/models/file";
import { ShareFile } from "../../domain/models/shareFile";
import { AppDataSource } from "../config/dataSource";
import { FileEntity } from "../entities/fileEntity";
import { RoleEntity } from "../entities/roleEntity";
import { SharedFileEntity } from "../entities/sharedFileEntity";
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
            path: file.path || hosting.location,
            user_id: file.user_id,
            is_shared: file.is_shared || false,
            directory_id: file.directory_id || null,
            created_at: file.created_at || new Date(),
            last_modified: file.created_at || new Date(),
            version: file.version || 1
        });     

        if (fileEntity.is_directory) {
            fileEntity.type = "folder";
        }

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

  async shareFile(fileId: string, userId: string, roleName: string): Promise<ShareFile> {
    const fileEntity = await AppDataSource.getRepository(FileEntity).findOneBy({
      id: fileId
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:116 ~ fileRepositoryImpl ~ fileEntity ~ fileEntity:", fileEntity, "fileId", fileId)
    if (!fileEntity) {
      logger.error("Archivo no encontrado");
      throw new Error("Archivo no encontrado");
    }
  
    // Buscar la entidad del usuario por su ID
    const userEntity = await AppDataSource.getRepository(UserEntity).findOne({
      where: {id: userId}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:135 ~ fileRepositoryImpl ~ shareFile ~ userEntity:", userEntity)
  
    if (!userEntity) {
      console.log("🚀 ~ file: fileRepositoryImpl.ts:140 ~ fileRepositoryImpl ~ shareFile ~ userEntity:", userEntity)
      logger.error("Usuario no encontrado");
      throw new Error("Usuario no encontrado");
    }
  
    // Buscar la entidad del rol por su nombre
    const roleEntity = await AppDataSource.getRepository(RoleEntity).findOne({
      where: {name: roleName}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:134 ~ fileRepositoryImpl ~ roleEntity ~ roleEntity:", roleEntity)

    if (!roleEntity) {
      logger.error("Rol no encontrado");
      throw new Error("Rol no encontrado");
    }

    if (fileEntity.is_shared) {
    
      const sharedFileEntity = new SharedFileEntity();
      sharedFileEntity.file = fileEntity;
      sharedFileEntity.user = userEntity;
      console.log("🚀 ~ file: fileRepositoryImpl.ts:161 ~ fileRepositoryImpl ~ shareFile ~ userEntity:", userEntity)
      sharedFileEntity.role = roleEntity;
    
      await AppDataSource.getRepository(SharedFileEntity).save(sharedFileEntity);
    
      logger.info(`Archivo compartido con éxito con el usuario ${userId}`);
      
      return new ShareFile(sharedFileEntity);
    }
    else {
      logger.error("Archivo no compartido");
      throw new Error("Archivo no compartido");
    }
  }  

  async mySharedFiles(userId: string): Promise<File[]> {
    const sharedFiles = await AppDataSource.getRepository(SharedFileEntity).find({
      where: { user: { id: userId } },
      relations: ['file']
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:166 ~ fileRepositoryImpl ~ sharedFiles ~ sharedFiles:", sharedFiles)
    return sharedFiles.map((sharedFile) => new File(sharedFile.file));
  }
  
  async findSharedById(id: string, fileId: string): Promise<File> {

    const userEntity = await AppDataSource.getRepository(UserEntity).findOne({
      where: {id}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:190 ~ fileRepositoryImpl ~ userEntity ~ userEntity:", userEntity)

    if (!userEntity) {
      console.log("🚀 ~ file: fileRepositoryImpl.ts:194 ~ fileRepositoryImpl ~ findSharedById ~ userEntity:", userEntity)
      logger.error("Usuario no encontrado");
      throw new Error("Usuario no encontrado");
    }

    const fileEntity = await AppDataSource.getRepository(FileEntity).findOneBy({
      id: fileId
    });

    if (!fileEntity) {
      logger.error("Archivo no encontrado");
      throw new Error("Archivo no encontrado");
    }

    const shareRepository = AppDataSource.getRepository(SharedFileEntity);
    const filer = await shareRepository.findOne({
      where: {user: userEntity , file: fileEntity}
    })
    console.log("🚀 ~ file: fileRepositoryImpl.ts:199 ~ fileRepositoryImpl ~ findSharedById ~ fileEntity:", fileEntity)

    return filer ? new File(fileEntity) : null;

  }

  async updateSharedFile(id: string, fileId: string, updateData: Partial<File>): Promise<File> {
    const userEntity = await AppDataSource.getRepository(UserEntity).findOne({
      where: {id}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:211 ~ fileRepositoryImpl ~ userEntity ~ userEntity:", userEntity)

    if (!userEntity) {
      logger.error("Usuario no encontrado");
      throw new Error("Usuario no encontrado");
    }

    const fileEntity = await AppDataSource.getRepository(FileEntity).findOne({
      where: {id: fileId}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:220 ~ fileRepositoryImpl ~ fileEntity ~ fileEntity:", fileEntity)

    if (!fileEntity) {
      logger.error("Archivo no encontrado");
      throw new Error("Archivo no encontrado");
    }

    const repository = AppDataSource.getRepository(SharedFileEntity);
    
    const filer = await repository.findOne({
      where: {user: userEntity , file: fileEntity},
      relations: ['role']
    })
    console.log("🚀 ~ file: fileRepositoryImpl.ts:243 ~ fileRepositoryImpl ~ updateSharedFile ~ filer:", filer, "role", filer.role.name)

        if (!filer) {
            logger.error(`FileRepository: Error al modificar al archivo con ID: ${id}.`);
            throw new Error('Archivo no encontrado');
        }

    if(filer.role.name == "lector"){
      logger.error("No puede actualizar este archivo");
      throw new Error("No tiene permiso de modificar este archivo");
    } else {
      AppDataSource.getRepository(FileEntity).merge(fileEntity, updateData);
        const updatedFile = await AppDataSource.getRepository(FileEntity).save(fileEntity);
        return updatedFile;
    }    
  }

  async deleteSharedFile(id: string, fileId: string): Promise<void> {
    logger.info("Eliminando file en Repository");

    const userEntity = await AppDataSource.getRepository(UserEntity).findOne({
      where: {id}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:211 ~ fileRepositoryImpl ~ userEntity ~ userEntity:", userEntity)

    if (!userEntity) {
      logger.error("Usuario no encontrado");
      throw new Error("Usuario no encontrado");
    }

    const fileEntity = await AppDataSource.getRepository(FileEntity).findOne({
      where: {id: fileId}
    });
    console.log("🚀 ~ file: fileRepositoryImpl.ts:220 ~ fileRepositoryImpl ~ fileEntity ~ fileEntity:", fileEntity)

    if (!fileEntity) {
      logger.error("Archivo no encontrado");
      throw new Error("Archivo no encontrado");
    }

    const repository = AppDataSource.getRepository(SharedFileEntity);
    
    const filer = await repository.findOne({
      where: {user: userEntity , file: fileEntity},
      relations: ['role']
    })
    console.log("🚀 ~ file: fileRepositoryImpl.ts:284 ~ fileRepositoryImpl ~ deleteSharedFile ~ filer:", filer)

        if (!filer) {
            logger.error(`FileRepository: Error al modificar al archivo con ID: ${id}.`);
            throw new Error('Archivo no encontrado');
        }

    if(filer.role.name == "lector"){
      logger.error("No puede eliminar este archivo");
      throw new Error("No tiene permiso de eliminar este archivo");
    } else {
      await AppDataSource.getRepository(FileEntity).remove(fileEntity);
    } 
  }
}