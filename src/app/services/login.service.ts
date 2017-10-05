import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service'

@Injectable()
export class LoginService {
  //use @angular HTTP
  constructor(
    private _http: Http,
    private authService: AuthService
  ) { }

  // Do something
  doSomething(data): Observable<any> {
    return this._http.get(data).map(this.extractData).catch(this.handleError);
  }

  login(username: string, password: string, callback?: any) {
    this.authService.authenticate(username, password, callback);
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
