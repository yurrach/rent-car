import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { Validators } from '@angular/forms';

const drive: CarFormParam = {
  type: 'text',
  name: 'drive',
  placeholder: 'Тип привода',
  label: 'Привод:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};
const transmissionType: CarFormParam = {
  type: 'text',
  name: 'transmissionType',
  placeholder: 'Коробка передач',
  label: 'Коробка передач:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};
const engineCc: CarFormParam = {
  type: 'text',
  name: 'engineCc',
  placeholder: 'Объём двигателя (см3)',
  label: 'Объем двигателя:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};
const engineFuel: CarFormParam = {
  type: 'text',
  name: 'engineFuel',
  placeholder: 'Тип топлива',
  label: 'Топливо:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};
const lkmMixed: CarFormParam = {
  type: 'text',
  name: 'lkmMixed',
  placeholder: 'Расход в смешанном цикле',
  label: 'Расход в смешанном цикле:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};
const body: CarFormParam = {
  type: 'text',
  name: 'body',
  placeholder: 'Тип кузова',
  label: 'Кузов:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};
const seats: CarFormParam = {
  type: 'text',
  name: 'seats',
  placeholder: 'Количество мест',
  label: 'Количество мест:',
  value: '',
  validators: [Validators.required],
  isShow: false,
};

export const apiCarFormParams: CarFormParam[] = [
  transmissionType,
  drive,
  engineCc,
  engineFuel,
  lkmMixed,
  body,
  seats,
];
