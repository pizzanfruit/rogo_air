
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

// import { ENDPOINTS } from 'app/common/endpoints.constant'


@Injectable()
export class LocationService {
  //use @angular HTTP
  constructor(private _http: Http) { }

  // Get all cities
  getLocation(id): Observable<any> {
    // let location = {
    //   name: "FPT Shop tiểu khu Mỹ Lâm",
    //   schedule: {},
    //   setpoint: 27.5,
    //   devices: [
    //     "1CED0000B1AC0000CAFE000000C405AC",
    //     "1CED0000B1AC0000CAFE000000C3F1EA",
    //     "1CED0000B1AC0000CAFE0000002478F7"
    //   ],
    //   mode: "MANUAL",
    //   address: "Hai Bà Trưng, Hà Nội",
    //   coordinate: "[20.98401, 105.846282]",
    //   id: "fc836438ebaa0103cbe6f77b60e3cce7"
    // }

    // let location2 = {
    //   name: "Cửa hàng FPT Shop 495A Trương Định",
    //   schedule: {},
    //   setpoint: 27.5,
    //   devices: [
    //     "1CED0000B1AC0000CAFE000000C405AC",
    //     "1CED0000B1AC0000CAFE000000C3F1EA",
    //     "1CED0000B1AC0000CAFE0000002478F7"
    //   ],
    //   mode: "MANUAL",
    //   address: "Số 495A Trương Định (Ngã tư Trương Định - Tân Mai ), Tổ 6, P. Tân Mai, Q. Hoàng Mai, TP. Hà Nội",
    //   coordinate: "[20.98401, 105.846282]",
    //   id: "fc836438ebaa0103cbe6f77b60e3cce7"
    // }
    // return Observable.of(location);
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + id).catch(this.handleError);
  }

  setPoint(id, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers });
    return this._http.post("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + id + "/setpoint", data, options).map(this.dataSuccess).catch(this.handleError);
  }

  setMode(id, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers });
    return this._http.post("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + id + "/modecontrol", data, options).map(this.dataSuccess).catch(this.handleError);
  }

  private dataSuccess(res: Response) {
    return res;
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
