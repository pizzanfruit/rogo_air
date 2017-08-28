import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  constructor(
    translate: TranslateService,
    private cookieService: CookieService
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
  }
}
