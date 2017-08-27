
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';


@Injectable()
export class DevicesService {
  //use @angular HTTP
  constructor(private _http: Http) { }

  // Get all cities
  getDevices(id): Observable<any> {
    // let devices = [
    //   {
    //     "ac": [
    //       "LG",
    //       "Samsung"
    //     ],
    //     "forcecontrol": false,
    //     "id": "1CED0000B1AC0000CAFE000000C405AC",
    //     "ismapped": true,
    //     "locationid": "fc836438ebaa0103cbe6f77b60e3cce7",
    //     "mode": "MANUAL",
    //     "name": "AC Salon",
    //     "setpoint": 29.5,
    //     "status": true,
    //     "type": "Rogo Air"
    //   },
    //   {
    //     "ac": [
    //       "LG",
    //       "Samsung"
    //     ],
    //     "forcecontrol": false,
    //     "id": "1CED0000B1AC0000CAFE000000C3F1EA",
    //     "ismapped": true,
    //     "locationid": "fc836438ebaa0103cbe6f77b60e3cce7",
    //     "mode": "MANUAL",
    //     "name": "Sensor Salon",
    //     "setpoint": 29.5,
    //     "status": false,
    //     "type": "Rogo Sensor"
    //   }
    // ];
    // return Observable.of(devices);
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + id + "/devices").catch(this.handleError);
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
