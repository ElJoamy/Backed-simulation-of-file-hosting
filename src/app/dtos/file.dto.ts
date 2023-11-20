export interface FileDto {
    id: string;
    name: string;
    is_directory: boolean;
    path: string;
    version: number;
    is_shared?: boolean;
    type?: string;
    directory_id: any;
    user_id: any;
}