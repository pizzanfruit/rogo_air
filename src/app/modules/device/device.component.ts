import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DeviceService } from '../../services/device.service';

//Jquery
declare var $: any;

@Component({
  selector: 'device-component',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})

export class DeviceComponent implements OnInit {

  //
  device: any;
  temp: number = 26.5;
  schedules: any[] = [
    { from: "6:00", to: "19:20", target: "29" },
    { from: "6:00", to: "19:20", target: "29" }
  ]

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) { }

  ngOnInit() {
    this.title.setTitle("Device details");
    this.route.params.subscribe((params) => {
      this.deviceService.getDevice(params.id).subscribe((device) => {
        this.device = device;
      });
    });
    this.switchToSettings();
    this.setUpSwitch();
    this.setUpTempControl();
    $(".switch-icon.b").css("opacity", 1);
  }

  setUpTempControl() {
    let i1, i2;
    $(".minus-icon").on("mousedown", () => {
      this.temp = this.temp - 0.1;
      clearInterval(i1);
      i1 = setInterval(() => {
        this.temp = this.temp - 0.1;
      }, 200);
    });
    $(".minus-icon").on("mouseup", () => {
      clearInterval(i1);
    });
    $(".plus-icon").on("mousedown", () => {
      this.temp = this.temp + 0.1;
      clearInterval(i2);
      i2 = setInterval(() => {
        this.temp = this.temp + 0.1;
      }, 200);
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
    $(".history-content").show();
    $(".settings").removeClass("active");
    $(".settings-content").hide();
  }

  switchToSettings() {
    $(".settings").addClass("active");
    $(".settings-content").show();
    $(".history").removeClass("active");
    $(".history-content").hide();
  }
}
