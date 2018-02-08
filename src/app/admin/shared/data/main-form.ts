import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { Validators } from '@angular/forms';

const year: CarFormParam = {
  type: 'select',
  name: 'year',
  placeholder: 'Укажите год выпуска',
  label: 'Год выпуска:',
  value: null,
  validators: [Validators.required],
  optionsList: null,
  listName: '',
};
const make: CarFormParam = {
  type: 'select',
  name: 'make',
  placeholder: 'Укажите марку',
  label: 'Марка:',
  value: null,
  validators: [Validators.required],
  optionsList: null,
  listName: 'make_display',
};
const model: CarFormParam = {
  type: 'select',
  name: 'model',
  placeholder: 'Укажите модель',
  label: 'Модель:',
  value: null,
  validators: [Validators.required],
  optionsList: null,
  listName: 'model_name',
};
const trim: CarFormParam = {
  type: 'select',
  name: 'trim',
  placeholder: 'Укажите комплектацию',
  label: 'Комплектация:',
  value: null,
  validators: [Validators.required],
  optionsList: null,
  listName: 'model_trim',
};

export const mainCarFormParams: CarFormParam[] = [year, make, model, trim];
