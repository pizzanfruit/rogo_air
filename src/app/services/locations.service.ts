import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';


@Injectable()
export class LocationsService {
  //use @angular HTTP
  constructor(private _http: Http) { }

  // Get all cities
  getCities(): Observable<any> {
    let cities = [
      {name: "Toàn quốc"},
      {name: "Hà Nội"},
      {name: "Hồ Chí Minh"},
      {name: "Đà Nẵng"},
    ]
    return Observable.of(cities);
    // return this._http.get("url").map(this.extractData).catch(this.handleError);
  }

  // Get all cities
  getDistricts(): Observable<any> {
    let districts = [
      {name: "Tất cả quận huyện"},
      {name: "Đống Đa"},
      {name: "Ba Đình"},
      {name: "Cầu giấy"},
    ]
    return Observable.of(districts);
    // return this._http.get("url").map(this.extractData).catch(this.handleError);
  }

  //extract data from returned json
  private extractData(res: Response) {
    let body = res.json();
    return body.info;
  }

  //log error
  private handleError(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
}
