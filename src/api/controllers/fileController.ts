import { Request, Response, Router } from 'express';
import { FileService } from "../../app/services/fileService";
import { FileDto } from "../../app/dtos/file.dto";
import logger from "../../infrastructure/logger/logger";

export class FileController {
    public router: Router;
    private fileService: FileService;


    constructor(fileService: FileService) {
        this.fileService = fileService;
        this.router = Router();
        this.routes();
    }

    // get all users
    public async getFiles(req: Request, res: Response): Promise<void> {
        const files: FileDto[] = await this.fileService.getFiles();
        res.json(files);
    }

    public async getFilesByUserId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const files: FileDto[] = await this.fileService.getFilesbyUserId(id);
        res.json(files);
    } 
    public async getFileById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const fileDto = await this.fileService.getFileById(id);

        if (!fileDto) {
            res.status(404).json({ message: 'File not found' });
            return;
        }

        res.json(fileDto);
    }

    public async createFile(req: Request, res: Response): Promise<Response> {
        try {
            const fileDto: FileDto = req.body;
            const file = await this.fileService.createFile(fileDto);
            return res.status(201).json(file);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: error });
        }
    }

    public async deleteFile(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            logger.debug(`Intentando eliminar al archivo con ID: ${id}`);
            await this.fileService.deleteFile(id);
            logger.info(`Archivo con ID: ${id} eliminado con éxito`);
            return res.status(200).json({ message: 'Archivo eliminado con éxito' });
        } catch (error) {
            logger.error(`Error al eliminar al usuario con ID: ${id}. Error: ${error}`);
            return res.status(500).json({ message: error });
        }
    }

    public async updateFile(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updateData = req.body;
        try {
            logger.debug(`Intentando actualizar al usuario con ID: ${id}`);
            const updatedFile = await this.fileService.updateFile(id, updateData);
            logger.info(`Usuario con ID: ${id} actualizado con éxito`);
            return res.status(200).json({ file: updatedFile });
        } catch (error) {
            logger.error(`Error al actualizar al usuario con ID: ${id}. Error: ${error}`);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    };

    public routes() {
        this.router.get('/:id', this.getFileById.bind(this));
        this.router.post('/', this.createFile.bind(this));
        this.router.get('/', this.getFiles.bind(this));
        this.router.get('/myfiles/:id', this.getFilesByUserId.bind(this));
        this.router.delete('/:userId', this.deleteFile.bind(this));
        this.router.put('/:userId', this.updateFile.bind(this));
    }
}