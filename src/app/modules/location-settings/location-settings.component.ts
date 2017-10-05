import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { LocationsService } from '../../services/locations.service';

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
  // ID
  parentId: any;
  //
  isLoading: boolean = true;
  isAddScheduleLoading: boolean = false;
  isSetpointLoading: boolean = false;
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
  // Gantt chart
  scheduleDay: string = "THU";
  daysOfWeek = [
    "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"
  ]
  hoursOfDay = [
    "0 AM", "1 AM", "2 AM", "3 AM",
    "4 AM", "5 AM", "6 AM", "7 AM",
    "8 AM", "9 AM", "10 AM", "11 AM",
    "12 AM", "1 PM", "2 PM", "3 PM",
    "4 PM", "5 PM", "6 PM", "7 PM",
    "8 PM", "9 PM", "10 PM", "11 PM"
  ]
  json = {
    "schedule": {
      "mon": [],
      "tue": [],
      "wed": [],
      "thu": [],
      "fri": [],
      "sat": [],
      "sun": [],
    }
  }

  constructor(
    private locationsService: LocationsService,
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
    this.setUpParentId();
    this.refreshLocation();
    this.switchToRogoAir();
  }

  ngAfterViewInit() {
  }

  setUpParentId() {
    this.refreshLocationSub = this.route.parent.params.subscribe((params) => {
      this.parentId = params.id;
    });
  }

  refreshLocation() {
    this.locationsService.getLocation(this.parentId).subscribe((res) => {
      this.location = JSON5.parse(res._body).body;
      this.setUpMode();
      this.isLoading = false;
      this.isSetpointLoading = false;
      this.isAddScheduleLoading = false;
      setTimeout(() => {
        this.setUpSwitch();
        this.setUpGanttChart();
      })
      // this.cdRef.detectChanges();
      if (this.location.setpoint && this.location.setpoint != "NaN") this.temp = parseFloat(this.location.setpoint);
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.isSetpointLoading = false;
      this.isAddScheduleLoading = false;
    });
  }

  /** Gantt chart */

  setUpGanttChart() {
    this.clearGanttChart();
    let schedule = this.location.schedule;
    let row = null;
    let col = null;
    for (let day in schedule) {
      if (schedule.hasOwnProperty(day)) {
        switch (day.toUpperCase()) {
          case "MON":
            row = 2;
            break;
          case "TUE":
            row = 3;
            break;
          case "WED":
            row = 4;
            break;
          case "THU":
            row = 5;
            break;
          case "FRI":
            row = 6;
            break;
          case "SAT":
            row = 7;
            break;
          case "SUN":
            row = 8;
            break;
        }
      }
      if (schedule[day]) {
        for (let i = 0; i < schedule[day].length; i++) {
          let current = schedule[day][i];
          let start = +current.start.split(":")[0] + 1;
          let end = +current.end.split(":")[0] - 1;
          let cells = $(".schedule-table tr:nth-child(" + row + ") > td:nth-child(n + " + start + "):nth-last-child(n + " + (24 - end) + ") > .hour-cell");
          cells.addClass("active");
          cells.eq(0).find(".target").html("TARGET: " + current.temperature + "°");
          cells.eq(0).find(".time").html(current.start + " - " + current.end);
        }
      }
    }
  }

  clearGanttChart() {
    $(".schedule-table .hour-cell").removeClass("active");
    $(".schedule-table .target, .schedule-table .time").html("");
  }

  //

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
      this.setModeSub = this.locationsService.setMode(this.parentId, data).subscribe((res) => {
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
    this.locationsService.setPoint(this.parentId, data).subscribe((res) => {
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

  setScheduleDay(day: string) {
    this.scheduleDay = day;
  }

  decreaseScheduleTemp() {
    this.scheduleTemp = this.scheduleTemp - 0.5;
  }

  increaseScheduleTemp() {
    this.scheduleTemp = this.scheduleTemp + 0.5;
  }

  setSchedule() {
    this.isAddScheduleLoading = true;
    let data = JSON.parse(JSON.stringify(this.json));
    if (this.allWeekSwitch) {
      for (let day of this.daysOfWeek) {
        let newDay = data.schedule[day.toLowerCase()];
        newDay.push({
          start: (this.startPeriod == "AM" ? this.startHour : +this.startHour + 12) + ":" + ("0" + this.startMinute).slice(-2),
          end: (this.endPeriod == "AM" ? this.endHour : +this.endHour + 12) + ":" + ("0" + this.endMinute).slice(-2),
          temperature: this.scheduleTemp.toFixed(2)
        })
      }
    } else {
      let newDay = data.schedule[this.scheduleDay.toLowerCase()];
      newDay.push({
        start: (this.startPeriod == "AM" ? this.startHour : +this.startHour + 12) + ":" + ("0" + this.startMinute).slice(-2),
        end: (this.endPeriod == "AM" ? this.endHour : +this.endHour + 12) + ":" + ("0" + this.endMinute).slice(-2),
        temperature: this.scheduleTemp.toFixed(2)
      })
    }
    this.locationsService.setSchedule(this.parentId, data).subscribe(() => {
      this.refreshLocation();
      $("#add-schedule-modal").modal("hide");
    }, err => {
      console.log(err);
      this.isAddScheduleLoading = false;
    });
  }

  // End add schedule modal

}
