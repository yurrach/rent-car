import { Injectable } from '@angular/core';
import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { Validators } from '@angular/forms';
import { mainCarFormParams } from '../data/main-form';
import { apiCarFormParams } from '../data/api-form';
import { customCarFormParams } from '../data/custom-form';

@Injectable()
export class CarFormDataService {
  constructor() {}

  get mainCarFormParams(): CarFormParam[] {
    mainCarFormParams[0].optionsList$ = this.getYearsList$(2000);
    return mainCarFormParams;
  }

  get apiCarFormParams(): CarFormParam[] {
    return apiCarFormParams;
  }

  get customCarFormParams(): CarFormParam[] {
    return customCarFormParams;
  }

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
