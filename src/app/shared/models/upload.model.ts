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
    this.name = this.createName(file.name);
  }
  private createName(string: string) {
    const arr = string.split('.');
    arr[arr.length - 2] += '_' + Date.now();
    return arr.join('.');
  }
}
