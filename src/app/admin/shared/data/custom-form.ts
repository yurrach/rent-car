import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { Validators } from '@angular/forms';

const isAirConditioning: CarFormParam = {
  type: 'checkbox',
  name: 'isAirConditioning',
  placeholder: 'Кондиционер:',
  label: 'Кондиционер:',
  value: null,
  validators: [],
};
const isNew: CarFormParam = {
  type: 'checkbox',
  name: 'isNew',
  placeholder: 'Новинка:',
  label: 'Новинка:',
  value: null,
  validators: [],
};
const isSale: CarFormParam = {
  type: 'checkbox',
  name: 'isSale',
  placeholder: 'Скидка:',
  label: 'Скидка:',
  value: null,
  validators: [],
};
const saleAmount: CarFormParam = {
  type: 'text',
  name: 'saleAmount',
  placeholder: 'Величина скидки %:',
  label: 'Величина скидки %:',
  value: null,
  validators: [],
};
const carImages: CarFormParam = {
  type: 'file',
  name: 'carImages',
  placeholder: 'Загрузите фото:',
  label: 'Загрузите фото:',
  value: null,
  validators: [],
};
const additionalInfo: CarFormParam = {
  type: 'textarea',
  name: 'additionalInfo',
  placeholder: 'Напишите дополнительные данные',
  label: 'Дополнительная информация:',
  value: null,
  validators: [Validators.required],
};
const price: CarFormParam = {
  type: 'text',
  name: 'pricing',
  placeholder: 'Цена',
  label: 'Цена:',
  value: null,
  validators: [Validators.required],
};

export const customCarFormParams: CarFormParam[] = [
  isAirConditioning,
  isNew,
  isSale,
  saleAmount,
  price,
  carImages,
  additionalInfo,
];
