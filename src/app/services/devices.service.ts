
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service'

//Jquery
declare var $: any;

@Injectable()
export class DevicesService {
  //use @angular HTTP
  constructor(
    private _http: Http,
    private authService: AuthService
  ) { }

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
    let headers = new Headers({ 'Authorization': this.authService.idToken });
    let options = new RequestOptions({ headers });
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + id + "/devices", options).catch(this.handleError);
  }

  searchDevice(id): Observable<any> {
    let headers = new Headers({ 'Authorization': this.authService.idToken });
    let options = new RequestOptions({ headers });
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/device/" + id, options);
  }

  registerDeviceToLocation(locationId, userId, label): Observable<any> {
    let data = {
      "userid": "9dc9496c7bf111e7bb31be2e44b06b34",
      "label": label
    }
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.authService.idToken });
    let options = new RequestOptions({ headers });
    return this._http.post("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + locationId + "/mapdevicewithlocaiton/" + userId, data, options).catch(this.handleError);
  }

  getCurrentDeviceDatalog(id): Observable<any> {
    let headers = new Headers({ 'Authorization': this.authService.idToken });
    let options = new RequestOptions({ headers });
    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().split("T")[0];
    return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/device/" + id + "/datalog?time=" + encodeURIComponent(localISOTime + "ZZ+07:00"), options).catch(this.handleError);
  }

  //extract data from returned json
  private extractData(res: Response) {
    let body = res.json();
    return body.info;
  }

  //log error
  private handleError(error: Response | any) {
    console.error(error.message || error);
    if (error && error.status == 401) {
      $("#message-modal").modal("show");
    }
    return Observable.throw(error.message || error);
  }
}
