import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

//Jquery
declare var $: any;

@Component({
  selector: 'settings-component',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  constructor(
    private translate: TranslateService
  ) { }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
