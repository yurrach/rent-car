import { Injectable } from '@angular/core';
import { CarFormParam } from '../models/car-form-param.model';
import { Observable } from 'rxjs/Observable';
import { mainCarFormParams } from '../data/main-form';
import { apiCarFormParams } from '../data/api-form';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/delay';

@Injectable()
export class CarFormDataService {
  currentCarParams: [any];

  constructor(private http: HttpClient) {}

  get mainCarFormParams(): CarFormParam[] {
    mainCarFormParams[0].optionsList$ = this.getYearsList$(2000);
    return mainCarFormParams;
  }

  get apiCarFormParams(): CarFormParam[] {
    return apiCarFormParams;
  }

  private getYearsList$(startYear): Observable<number[]> {
    const yearsList = [];
    const endYear = new Date().getFullYear();
    for (let i = startYear; i <= endYear; i++) {
      yearsList.push(i);
    }
    return Observable.of(yearsList);
  }

  public getFormControlConfig(formParamsArray: CarFormParam[]) {
    const formControlConfigObj: { [paramName: string]: [string, any[]] } = {};
    formParamsArray.forEach(({ name, value, validators }) => {
      formControlConfigObj[name] = [value, validators];
    });
    return formControlConfigObj;
  }

  getQueryUrl({ year, make, model }, listName?) {
    const baseApiUrl = `https://www.carqueryapi.com/api/0.3/?cmd=`;
    let query = '';
    let cmd = '';
    if (listName === 'make_display') {
      query = '&year=' + year;
      cmd = 'getMakes';
    }
    if (listName === 'model_name') {
      query = '&year=' + year + '&make=' + make;
      cmd = 'getModels';
    }
    if (listName === 'model_trim') {
      query = '&year=' + year + '&make=' + make + '&model=' + model;
      cmd = 'getTrims';
    }

    return baseApiUrl + cmd + query;
  }

  getCarParamsList$(dataQuery, listName) {
    const jsonpCallback = `callback`;
    const url = this.getQueryUrl(dataQuery, listName);

    return this.http
      .jsonp(url, jsonpCallback)
      .map(res => {
        if (res['error']) {
          res = {
            cars: [
              {
                make_display: 'Citroen',
                model_name: 'C5',
              },
              {
                make_display: 'Audi',
                model_name: 'A6',
              },
            ],
          };
        }
        const paramsArray: [any] = Object.values(res)[0];
        if (listName === 'model_trim') {
          this.currentCarParams = paramsArray;
        }
        return paramsArray.map(param => param[listName]);
      })
      .publishLast()
      .refCount();
  }
  getCarParamsByTrim(trim) {
    const params = this.currentCarParams.filter(
      car => car['model_trim'] === trim,
    )[0];
    return {
      drive: params.model_drive,
      transmissionType: params.model_transmission_type,
      engineCc: params.model_engine_cc,
      engineFuel: params.model_engine_fuel,
      lkmMixed: params.model_lkm_mixed,
      body: params.model_body,
      seats: params.model_seats,
    };
  }
}
