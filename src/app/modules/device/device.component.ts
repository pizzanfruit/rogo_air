import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DeviceService } from '../../services/device.service';
import { MdDatepicker } from '@angular/material'
import * as moment from 'moment';

//Jquery
declare var $: any;

@Component({
  selector: 'device-component',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})

export class DeviceComponent implements OnInit {
  @ViewChild(MdDatepicker)
  private mdDatepicker;

  //
  device: any;
  temp: number = 26.5;
  schedules: any[] = [
    { from: "6:00", to: "19:20", target: "29" },
    { from: "6:00", to: "19:20", target: "29" }
  ]

  // History tab
  currentDate: Date;
  currentMonthYear: string;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) {
    this.currentDate = new Date(2017, 6, 28);
    this.currentMonthYear = moment(this.currentDate).format('MMMM YYYY');
  }

  ngOnInit() {
    this.title.setTitle("Device details");
    this.route.params.subscribe((params) => {
      this.deviceService.getDevice(params.id).subscribe((device) => {
        this.device = device;
      });
    });
    this.switchToHistory();
    this.setUpSwitch();
    //this.setUpTempControl();
    $(".switch-icon.b").css("opacity", 1);
  }

  updateMonthYear() {
    this.currentMonthYear = moment(this.currentDate).format('MMMM YYYY');
  }

  openDatepicker() {
    this.mdDatepicker.open();
  }

  setUpTempControl() {
    let i1, i2;
    $(".minus-icon").on("mousedown", () => {
      this.temp = this.temp - 0.1;
      clearInterval(i1);
      i1 = setInterval(() => {
        this.temp = this.temp - 0.1;
      }, 300);
    });
    $(".minus-icon").on("mouseup", () => {
      clearInterval(i1);
    });
    $(".plus-icon").on("mousedown", () => {
      this.temp = this.temp + 0.1;
      clearInterval(i2);
      i2 = setInterval(() => {
        this.temp = this.temp + 0.1;
      }, 300);
    });
    $(".plus-icon").on("mouseup", () => {
      clearInterval(i2);
    });
  }

  decreaseTemp() {
    this.temp = this.temp - 0.1;
  }

  increaseTemp() {
    this.temp = this.temp + 0.1;
  }

  setUpSwitch() {
    $(".switch-icon").click((event) => {
      $(".switch-icon").css("opacity", 0);
      $(event.target).css("opacity", 1);
    });
  }

  switchToHistory() {
    $(".history").addClass("active");
    $(".history-content").css("display", "flex");
    $(".settings").removeClass("active");
    $(".settings-content").hide();
  }

  switchToSettings() {
    $(".settings").addClass("active");
    $(".settings-content").show();
    $(".history").removeClass("active");
    $(".history-content").hide();
  }

  backToDevices() {
    this.router.navigate(["tabs/devices"]);
  }
}
