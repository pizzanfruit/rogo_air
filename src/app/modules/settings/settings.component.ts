import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';

//Jquery
declare var $: any;

@Component({
  selector: 'settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService
  ) { }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.cookieService.put("lang", lang);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
