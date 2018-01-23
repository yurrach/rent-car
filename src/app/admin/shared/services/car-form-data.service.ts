import { Injectable } from '@angular/core';
import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { Validators } from '@angular/forms';

@Injectable()
export class CarFormDataService {
  constructor() {}

  /*   private year: CarFormParam = {
    type: 'select',
    name: 'year',
    placeholder: 'Укажите год выпуска',
    label: 'Год выпуска:',
    value: '',
    validators: [Validators.required],
    optionsList$: this.getYearsList$(2000),
    listName: '',
  };
  private make: CarFormParam = {
    type: 'select',
    name: 'make',
    placeholder: 'Укажите марку',
    label: 'Марка:',
    value: '',
    validators: [Validators.required],
    optionsList$: Observable.of(null),
    listName: 'make_display',
  };
  private model: CarFormParam = {
    type: 'select',
    name: 'model',
    placeholder: 'Укажите модель',
    label: 'Модель:',
    value: '',
    validators: [Validators.required],
    optionsList$: Observable.of(null),
    listName: 'model_name',
  };
  private trim: CarFormParam = {
    type: 'select',
    name: 'trim',
    placeholder: 'Укажите комплектацию',
    label: 'Комплектация:',
    value: '',
    validators: [Validators.required],
    optionsList$: Observable.of(null),
    listName: 'model_trim',
  }; */

  /*   private isAirConditioning: CarFormParam = {
    type: 'checkbox',
    name: 'isAirConditioning',
    placeholder: 'Кондиционер:',
    label: 'Кондиционер:',
    value: null,
    validators: [],
  };
  private isNew: CarFormParam = {
    type: 'checkbox',
    name: 'isNew',
    placeholder: 'Новинка:',
    label: 'Новинка:',
    value: null,
    validators: [],
  };
  private isSale: CarFormParam = {
    type: 'checkbox',
    name: 'isSale',
    placeholder: 'Скидка:',
    label: 'Скидка:',
    value: null,
    validators: [],
  };
  private saleAmount: CarFormParam = {
    type: 'text',
    name: 'saleAmount',
    placeholder: 'Величина скидки %:',
    label: 'Величина скидки %:',
    value: null,
    validators: [],
  };
  private carImages: CarFormParam = {
    type: 'file',
    name: 'carImages',
    placeholder: 'Загрузите фото:',
    label: 'Загрузите фото:',
    value: null,
    validators: [],
  };
  private additionalInfo: CarFormParam = {
    type: 'textarea',
    name: 'additionalInfo',
    placeholder: 'Напишите дополнительные данные',
    label: 'Дополнительная информация:',
    value: null,
    validators: [Validators.required],
  };
  private price: CarFormParam = {
    type: 'text',
    name: 'pricing',
    placeholder: 'Цена',
    label: 'Цена:',
    value: null,
    validators: [Validators.required],
  }; */

  /*   private _mainCarFormParams: CarFormParam[] = [
    this.year,
    this.make,
    this.model,
    this.trim,
  ]; */

  /*   get mainCarFormParams(): CarFormParam[] {
    return this._mainCarFormParams;
  } */

  /*   private _apiCarFormParams: CarFormParam[] = [
    this.drive,
    this.engineCc,
    this.engineFuel,
    this.lkmMixed,
    this.body,
    this.seats,
  ];

  get apiCarFormParams(): CarFormParam[] {
    return this._apiCarFormParams;
  } */
  /*   private _customCarFormParams: CarFormParam[] = [
    this.isAirConditioning,
    this.isNew,
    this.isSale,
    this.saleAmount,
    this.price,
    this.carImages,
    this.additionalInfo,
  ];

  get customCarFormParams(): CarFormParam[] {
    return this._customCarFormParams;
  } */

  private getYearsList$(startYear): Observable<number[]> {
    const yearsList = [];
    const endYear = new Date().getFullYear();
    for (let i = startYear; i <= endYear; i++) {
      yearsList.push(i);
    }
    return Observable.of(yearsList);
  }

  getFormControlConfig(formParamsArray: CarFormParam[]) {
    const formControlConfigObj = {};
    formParamsArray.forEach(({ name, value, validators }) => {
      formControlConfigObj[name] = [value, validators];
    });
    return formControlConfigObj;
  }
}
