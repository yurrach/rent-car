import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { Validators } from '@angular/forms';

const year: CarFormParam = {
  type: 'select',
  name: 'year',
  placeholder: 'Укажите год выпуска',
  label: 'Год выпуска:',
  value: '',
  validators: [Validators.required],
  optionsList$: Observable.of(null),
  optionsList: [],
  listName: '',
  isShow: false,
};
const make: CarFormParam = {
  type: 'select',
  name: 'make',
  placeholder: 'Укажите марку',
  label: 'Марка:',
  value: '',
  validators: [Validators.required],
  optionsList$: Observable.of(null),
  optionsList: [],
  listName: 'make_display',
  isShow: false,
};
const model: CarFormParam = {
  type: 'select',
  name: 'model',
  placeholder: 'Укажите модель',
  label: 'Модель:',
  value: '',
  validators: [Validators.required],
  optionsList$: Observable.of(null),
  optionsList: [],
  listName: 'model_name',
  isShow: false,
};
const trim: CarFormParam = {
  type: 'select',
  name: 'trim',
  placeholder: 'Укажите комплектацию',
  label: 'Комплектация:',
  value: '',
  validators: [Validators.required],
  optionsList$: Observable.of(null),
  optionsList: [],
  listName: 'model_trim',
  isShow: false,
};

export const mainCarFormParams: CarFormParam[] = [year, make, model, trim];
