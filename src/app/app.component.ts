import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service'

//Jquery
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  constructor(
    private translate: TranslateService,
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('vn');
    let lang = this.cookieService.get("lang");
    if (lang) {
      translate.use(lang);
    } else {
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('vn');
    }
    // Authen
    let remember = this.cookieService.get("remember");
    if (remember == "true") this.authService.isLoggedIn = true;
  }

  handleModalButtonClick() {
    $("[id$='modal']").modal("hide");
    this.router.navigate(["login"]);
  }
}
