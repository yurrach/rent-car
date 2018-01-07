import { Observable } from 'rxjs/Observable';

export class CarFormControl {
  public name: string;
  public placeholder: string;
  public label: string;
  constructor({ name, placeholder, label }) {
    this.name = name;
    this.placeholder = placeholder;
    this.label = label;
  }
}
export class CarSelectFormControl extends CarFormControl {
  public optionsList$: Observable<string[] | number[]>;
  constructor({ name, placeholder, label }) {
    super({ name, placeholder, label });
    this.optionsList$ = Observable.of(null);
  }
}
