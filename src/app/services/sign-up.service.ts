import { Headers, RequestOptions } from "@angular/http";
import { Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";

import "rxjs/add/operator/map";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class SignUpService {
  //use @angular HTTP
  constructor(private _http: Http, private authService: AuthService) {}

  signUp(username: string, password: string, email: string, callback?: any) {
    this.authService.register(username, password, email, callback);
  }

  confirmUser(username: string, code: string, callback?: any) {
    this.authService.confirm(username, code, callback);
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
