
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

// import { ENDPOINTS } from 'app/common/endpoints.constant'


@Injectable()
export class SharedAccessService {
  //use @angular HTTP
  constructor(private _http: Http) { }

  getUsers(id): Observable<any> {
    let users: any[] = [
      { name: "Le Ngoc Tuan", email: "TuanLn3@fpt.com.vn", role: "READ" },
      { name: "Lucas Tony", email: "TonyL@fpt.com.vn", role: "MANAGE" },
    ];
    return Observable.of(users);
    // return this._http.get("https://tyu7xxj099.execute-api.us-east-1.amazonaws.com/release/location/" + id).catch(this.handleError);
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
