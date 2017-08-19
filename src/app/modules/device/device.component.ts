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
  }

  switchToHistory() {
    $(".history").addClass("active");
    $(".settings").removeClass("active");
  }

  switchToSettings() {
    $(".history").removeClass("active");
    $(".settings").addClass("active");
  }
}
