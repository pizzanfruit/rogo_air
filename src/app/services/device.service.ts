
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
  getDevice(locationId, deviceId): Observable<any> {
    // let device = {
    //   "ac": [
    //     "Daikin",
    //     "Panasonic"
    //   ],
    //   "forcecontrol": false,
    //   "id": "1CED0000B1AC0000CAFE000000C3F1EA",
    //   "ismapped": true,
    //   "locationid": "fc836438ebaa0103cbe6f77b60e3cce7",
    //   "mode": "MANUAL",
    //   "name": "AC Salon",
    //   "setpoint": 29.5,
    //   "status": true,
    //   "type": "Rogo Air"
    // }
    // return Observable.of(device);
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + locationId + "/mapdevicewithlocaiton/" + deviceId).catch(this.handleError);
  }

  getDeviceDatalog(id): Observable<any> {
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/device/" + id + "/datalog?period=DAY").catch(this.handleError);
  }

  setPoint(id, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers });
    return this._http.post("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/device/" + id + "/setpoint", data, options).map(this.dataSuccess).catch(this.handleError);
  }

  setForcecontrol(id, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers });
    return this._http.post("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/device/" + id + "/forcecontrol", data, options).map(this.dataSuccess).catch(this.handleError);
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
