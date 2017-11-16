import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CarApiService {
  baseApiUrl = `https://www.carqueryapi.com/api/0.3/?callback=`;
  jsonpCallback = `JSONP_CALLBACK`;

  constructor(private http: HttpClient) { }

  getList(params): any {

    const addQuery = '&cmd=' + params.cmd + '&year=' + params.year + '&make=' + params.make + '&model=' + params.model;

    const apiUrl = this.baseApiUrl + this.jsonpCallback + addQuery;

    return this.http.jsonp<Array<string>>(apiUrl, this.jsonpCallback );

  }


}
