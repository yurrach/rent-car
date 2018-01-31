import { Observable } from 'rxjs/Observable';

export class CarFormParam {
  public type: string;
  public name: string;
  public placeholder: string;
  public label: string;
  public value: string;
  public validators: Array<any>;
  public optionsList$?: Observable<string[] | number[]>;
  public optionsList?: string[] | number[];
  public listName?: string;
  public isShow?: Boolean;

  constructor() {}
}
