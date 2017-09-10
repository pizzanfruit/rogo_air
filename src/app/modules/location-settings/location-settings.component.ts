import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { LocationService } from '../../services/location.service';

//Jquery
declare var $: any;
// JSON5
var JSON5 = require('json5');

@Component({
  selector: 'location-settings-component',
  templateUrl: './location-settings.component.html',
  styleUrls: ['./location-settings.component.css']
})

export class LocationSettingsComponent implements OnInit {

  //
  temp: number = 20;
  temp2: number;
  schedules: any[] = [];
  location: any;
  //
  isLoading: boolean = true;
  isSetpointLoading: boolean = false;
  parentId: any;
  setModeSub: any;
  refreshLocationSub: any;
  // Schedule
  startHour: number = 12;
  startMinute: number = 0;
  startPeriod: string = "AM";
  endHour: number = 12;
  endMinute: number = 0;
  endPeriod: string = "AM";
  allWeekSwitch: boolean = false;
  weekday: string = "THU";
  scheduleTemp: number = 26.5;

  constructor(
    private locationService: LocationService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.isLoading = true;
    this.isSetpointLoading = false;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.refreshLocation();
    this.switchToRogoAir();
    $(".switch-icon.b").css("opacity", 1);
    this.setUpWeekday();
  }

  ngAfterViewInit() {
  }

  refreshLocation() {
    this.refreshLocationSub = this.route.parent.params.subscribe((params) => {
      this.parentId = params.id;
      this.locationService.getLocation(this.parentId).subscribe((res) => {
        this.location = JSON5.parse(res._body).body;
        this.setUpMode();
        this.isLoading = false;
        setTimeout(() => {
          this.setUpSwitch();
        })
        this.cdRef.detectChanges();
        if (this.location.setpoint && this.location.setpoint != "NaN") this.temp = parseFloat(this.location.setpoint);
        this.isSetpointLoading = false;
      }, (err) => {
        console.log(err);
        this.isLoading = false;
        this.isSetpointLoading = false;
      });
    });
  }

  decreaseTemp() {
    this.temp2 = this.temp - 0.5;
    this.setPoint();
  }

  increaseTemp() {
    this.temp2 = this.temp + 0.5;
    this.setPoint();
  }

  setUpSwitch() {
    $(".switch-icon").unbind();
    $(".switch-icon").click((event) => {
      if (this.setModeSub) this.setModeSub.unsubscribe();
      $(".switch-icon").css("opacity", 0);
      $(event.target).css("opacity", 1);
      let img = $(event.target);
      let data = {};
      if (img.hasClass("a")) data = { mode: "NOOPERATION" };
      else if (img.hasClass("b")) data = { mode: "SETPOINT" };
      else if (img.hasClass("c")) data = { mode: "SCHEDULE" };
      else if (img.hasClass("d")) data = { mode: "OFF" };
      this.setModeSub = this.locationService.setMode(this.parentId, data).subscribe((res) => {
        this.refreshLocation();
      });
    });
  }

  switchToRogoAir() {
    $(".rogo-air-tab").addClass("active");
    $(".rogo-air-content").css("display", "flex");
  }

  setUpMode() {
    $(".switch-icon").css("opacity", 0);
    setTimeout(() => {
      if (this.location && this.location.mode) {
        switch (this.location.mode.toUpperCase()) {
          case "NOOPERATION":
            $(".switch-icon.a").css("opacity", 1);
            break;
          case "SETPOINT":
            $(".switch-icon.b").css("opacity", 1);
            break;
          case "SCHEDULE":
            $(".switch-icon.c").css("opacity", 1);
            break;
          case "OFF":
            $(".switch-icon.d").css("opacity", 1);
            break;
          default:
            $(".switch-icon.a").css("opacity", 1);
            console.log($(".switch-icon.a").css("opacity"));
            break;
        }
      }
    });
  }

  setPoint() {
    this.isSetpointLoading = true;
    let data = {
      "setpoint": this.temp2.toFixed(1)
    }
    this.locationService.setPoint(this.parentId, data).subscribe((res) => {
      this.refreshLocation();
    }, (err) => {
      console.log(err);
      this.isSetpointLoading = false;
    });
  }

  // Add schedul modal

  openAddScheduleModal() {
    $("#add-schedule-modal").modal("show");
  }

  closeAddScheduleModal() {
    $("#add-schedule-modal").modal("hide");
  }

  plusStartHour() {
    this.startHour = ++this.startHour % 13;
  }

  minusStartHour() {
    this.startHour = --this.startHour % 13;
    if (this.startHour === -1) this.startHour = 12;
  }

  plusStartMinute() {
    this.startMinute = ++this.startMinute % 60;
  }

  minusStartMinute() {
    this.startMinute = --this.startMinute % 60;
    if (this.startMinute === -1) this.startMinute = 59;
  }

  toggleStartPeriod() {
    if (this.startPeriod === "AM") this.startPeriod = "PM";
    else this.startPeriod = "AM";
  }

  plusEndHour() {
    this.endHour = ++this.endHour % 13;
  }

  minusEndHour() {
    this.endHour = --this.endHour % 13;
    if (this.endHour === -1) this.endHour = 12;
  }

  plusEndMinute() {
    this.endMinute = ++this.endMinute % 60;
  }

  minusEndMinute() {
    this.endMinute = --this.endMinute % 60;
    if (this.endMinute === -1) this.endMinute = 59;
  }

  toggleEndPeriod() {
    if (this.endPeriod === "AM") this.endPeriod = "PM";
    else this.endPeriod = "AM";
  }

  setUpWeekday() {
    $(".weekday").click((event) => {
      let weekday = $(event.target);
      weekday.siblings().removeClass("active");
      weekday.addClass("active");
      this.weekday = weekday.html();
    })
  }

  decreaseScheduleTemp() {
    this.scheduleTemp = this.scheduleTemp - 0.5;
  }

  increaseScheduleTemp() {
    this.scheduleTemp = this.scheduleTemp + 0.5;
  }

  addSchedule() {
    console.log("ADD SCHEDULE");
  }

  // End add schedule modal

}
