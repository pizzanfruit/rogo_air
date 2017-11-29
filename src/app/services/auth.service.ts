import { Headers, RequestOptions } from "@angular/http";
import { Http, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { CookieService } from "ngx-cookie";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/delay";

const PoolData = {
  UserPoolId: "us-east-1_LYlCaEWjH",
  ClientId: "75cp5nc8b9rnvm2fija1feu47o"
};

const userPool = new CognitoUserPool(PoolData);

@Injectable()
export class AuthService {
  isLoggedIn = false;
  idToken: string;
  accessToken: string;
  // store the URL so we can redirect after logging in
  redirectUrl: string = "";

  //use @angular HTTP
  constructor(
    private _http: Http,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.idToken = localStorage.getItem("id_token");
    this.accessToken = localStorage.getItem("access_token");
  }

  register(username: string, password: string, email: string, callback?: any) {
    let dataEmail = {
      Name: "email",
      Value: email
    };
    let attributeEmail = new CognitoUserAttribute(dataEmail);
    let attributeList = [].concat(attributeEmail);
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        console.error(err);
        if (callback) callback(null);
        return;
      }
      let cognitoUser = result.user;
      console.log("user name is " + cognitoUser.getUsername());
      if (callback) callback(cognitoUser);
    });
  }

  confirm(username: string, code: string, callback?: any) {
    let userData = {
      Username: username,
      Pool: userPool
    };
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.error(err);
        if (callback) callback(null);
        return;
      }
      console.log("call result: " + result);
      if (callback) callback(result);
    });
  }

  authenticate(username: string, password: string, callback?: any) {
    this.isLoggedIn = false;
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    // Authenticate
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: result => {
        this.cookieService.put("remember", "true", {
          expires: ""
        });
        // Get token
        let idToken = result.getIdToken().getJwtToken();
        let accessToken = result.getAccessToken().getJwtToken();
        this.idToken = idToken;
        this.accessToken = accessToken;
        localStorage.setItem("id_token", idToken);
        localStorage.setItem("access_token", accessToken);
        this.isLoggedIn = true;
        this.router.navigate([this.redirectUrl]);
        if (callback) callback();
      },
      onFailure: err => {
        console.log(
          "There was an error during login, please try again -> ",
          err
        );
        if (callback) callback();
      },
      newPasswordRequired: (userAtributes, requiredAttributes) => {
        console.log("New password required");
      }
    });
  }

  logout() {
    let currUser = userPool.getCurrentUser();
    if (currUser != null) currUser.signOut();
    this.isLoggedIn = false;
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    this.router.navigate(["login"]);
  }
}
