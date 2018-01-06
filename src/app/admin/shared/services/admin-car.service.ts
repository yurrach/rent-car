import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class AdminCarService {

  constructor(
    private http: HttpClient
  ) { }

  getCarParamsList$({ year, make, model }, listName) {
    Observable
    const baseApiUrl = `https://www.carqueryapi.com/api/0.3/?callback=JSONP_CALLBACK&cmd=get`;

    const jsonpCallback = `JSONP_CALLBACK`;
    const makeQuery = 'Makes&year=' + year;
    const modelQuery = 'Models&year=' + year + '&make=' + make;
    const trimQuery = 'Trims&year='+year+'&make='+make+'&model='+model;
    const query = {
      'make_display': makeQuery,
      'model_name': modelQuery,
      'model_trim': trimQuery
    }
    // const query = model ? trimQuery : make ? modelQuery : makeQuery;

    return this.http.jsonp(baseApiUrl + query[listName], jsonpCallback)
      .map(res => {
        console.log('change');  
        const paramsArray: [any] = Object.values(res)[0];
      return paramsArray.map(param => param[listName]);
      }).publishLast().refCount();
  }
}
