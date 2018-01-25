import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/delay';

@Injectable()
export class AdminCarService {
  currentCar: [any];

  constructor(private http: HttpClient) {}

  getQueryUrl({ year, make, model }) {
    const baseApiUrl = `https://www.carqueryapi.com/api/0.3/?cmd=`;
    let query = '';
    let cmd = '';
    if (year) {
      query = '&year=' + year;
      cmd = 'getMakes';
    }
    if (make) {
      query += '&make=' + make;
      cmd = 'getModels';
    }
    if (model) {
      query += '&model=' + model;
      cmd = 'getTrims';
    }

    return baseApiUrl + cmd + query;
  }

  getCarParamsList$(url, listName) {
    const jsonpCallback = `callback`;

    return this.http
      .jsonp(url, jsonpCallback)
      .map(res => {
        const paramsArray: [any] = Object.values(res)[0];
        if (listName === 'model_trim') {
          this.currentCar = paramsArray;
        }
        return paramsArray.map(param => param[listName]);
      })
      .delay(500)
      .publishLast()
      .refCount();
  }
  getCarParamsByTrim(trim) {
    const params = this.currentCar.filter(car => car['model_trim'] === trim)[0];
    return {
      drive: params.model_drive,
      engineCc: params.model_engine_cc,
      engineFuel: params.model_engine_fuel,
      lkmMixed: params.model_lkm_mixed,
      body: params.model_body,
      seats: params.model_seats,
    };
  }
}
