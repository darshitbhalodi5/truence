declare module 'file' {
    export interface UploadedFile {
      url: string;
      filename: string;
      mimetype: string;
      size: number;
    }
  }