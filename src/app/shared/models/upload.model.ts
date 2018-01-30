export class Upload {
  id?: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date;

  constructor(file: File) {
    this.file = file;
    this.progress = 0;
    this.createdAt = new Date();
  }
}
