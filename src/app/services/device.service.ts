
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';


@Injectable()
export class DeviceService {
  //use @angular HTTP
  constructor(private _http: Http) { }

  // Get all cities
  getDevice(id): Observable<any> {
    let device = {
      name: "Rogo Air " + id,
      location: "FPT Shop 198 Trần Hưng Đạo"
    }
    return Observable.of(device);
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
