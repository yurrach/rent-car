import { Injectable } from '@angular/core';
import { CarSelectFormControl } from '../models/car-form-control';

@Injectable()
export class CarFormDataService {
  constructor() {}

  get carMainFormControls() {
    return [
      new CarSelectFormControl({
        name: 'year',
        placeholder: 'Укажите год выпуска',
        label: 'Год выпуска:',
      }),
      new CarSelectFormControl({
        name: 'make',
        placeholder: 'Укажите марку',
        label: 'Марка:',
      }),
      new CarSelectFormControl({
        name: 'model',
        placeholder: 'Укажите модель',
        label: 'Модель:',
      }),
      new CarSelectFormControl({
        name: 'trim',
        placeholder: 'Укажите комплектацию',
        label: 'Комплектация:',
      }),
    ];
  }
}
