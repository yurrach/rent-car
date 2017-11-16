export class CarParam {
  name: string;

  capName: string;
  list: any[];
  queryName: string;
  cmd: string;
  constructor(name: string, queryName: string) {
    this.name = name;
    this.capName = name[0].toUpperCase() + name.slice(1);
    this.list = [];
    this.cmd = 'get' + this.capName + 's';
    this.queryName = queryName;
  }
}
