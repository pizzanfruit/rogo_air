import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { LocationService } from '../../services/location.service';

//Jquery
declare var $: any;

@Component({
  selector: 'location-settings-component',
  templateUrl: './location-settings.component.html',
  styleUrls: ['./location-settings.component.css']
})

export class LocationSettingsComponent implements OnInit {

  //
  temp: number = 20;
  schedules: any[] = [];

  constructor(
    private locationService: LocationService,
    private translate: TranslateService
  ) { }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.switchToRogoAir();
    this.setUpSwitch();
    $(".switch-icon.b").css("opacity", 1);
  }

  ngAfterViewInit() {
  }

  decreaseTemp() {
    this.temp = this.temp - 0.5;
  }

  increaseTemp() {
    this.temp = this.temp + 0.5;
  }

  setUpSwitch() {
    $(".switch-icon").click((event) => {
      $(".switch-icon").css("opacity", 0);
      $(event.target).css("opacity", 1);
    });
  }

  switchToRogoAir() {
    $(".rogo-air-tab").addClass("active");
    $(".rogo-air-content").css("display", "flex");
  }

}
