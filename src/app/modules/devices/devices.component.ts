import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgSwitch } from '@angular/common';

import { DevicesService } from '../../services/devices.service';

import { Observable } from 'rxjs';

// Jquery
declare var $: any;
// JSON5
var JSON5 = require('json5');

@Component({
  selector: 'devices-component',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})

export class DevicesComponent implements OnInit {

  //
  isLoading: boolean = true;
  isAddLoading: boolean = false;
  filteredItems: any[] = [];

  //
  parentId: any;

  devices: any[];

  filters: any[] = [
    { name: "Rogo Air", value: 1 },
    { name: "Rogo Sensor", value: 2 },
    { name: "Rogo Alfa", value: 3 }
  ]

  selectedFilter: number = 0;

  // Auto update temp
  intervals: any[] = [];

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private devicesService: DevicesService
  ) {
    this.isLoading = true;
    this.isAddLoading = false;
  }

  ngOnInit() {
    this.setUpParentId();
    this.title.setTitle("Devices");
    this.refreshDevices();
  }

  ngOnDestroy() {
    for (let i = 0; i < this.intervals.length; i++) {
      let interval = this.intervals[i];
      clearInterval(interval);
    }
  }

  setUpParentId() {
    this.route.parent.params.subscribe((params) => {
      this.parentId = params['id'];
    });
  }

  refreshDevices() {
    this.devicesService.getDevices(this.parentId).subscribe((res) => {
      this.devices = JSON5.parse(res._body).body;
      this.assignCopy();
      this.isLoading = false;
      this.isAddLoading = false;
      this.setUpAutoUpdateTemp();
    }, (err) => {
      console.log(err);
      this.isLoading = false;
      this.isAddLoading = false;
    });

  }

  openAddDeviceModal() {
    $(".device-found").hide();
    $(".device-found-add").hide();
    $(".device-not-found").hide();
    $("#add-device-modal").modal("show");
  }

  scale1() {
    $("input+.underline.one").css("transform", "scale(1)");
  }

  scale0() {
    $("input+.underline.one").css("transform", "scale(0)");
  }

  scale1Two() {
    $("input+.underline.two").css("transform", "scale(1)");
  }

  scale0Two() {
    $("input+.underline.two").css("transform", "scale(0)");
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.devices, this.devices.slice());
  }

  filterItem() {
    let value = $("#filter-select").val();
    switch (value) {
      case "0":
        this.filteredItems = Object.assign([], this.devices);
        break;
      case "1":
        this.filteredItems = Object.assign([], this.devices).filter(
          item => item.type.toLowerCase().indexOf("air") > -1
        )
        break;
      case "2":
        this.filteredItems = Object.assign([], this.devices).filter(
          item => item.type.toLowerCase().indexOf("sensor") > -1
        )
        break;
      case "3":
        this.filteredItems = Object.assign([], this.devices).filter(
          item => item.type.toLowerCase().indexOf("alfa") > -1
        )
        break;
    }
  }

  addDevice() {
    this.isAddLoading = true;
    let deviceId = $("#device-search-input").val();
    this.devicesService.registerDeviceToLocation(this.parentId, deviceId).subscribe((res) => {
      this.refreshDevices();
      $("#add-device-modal").modal("hide");
    }, (err) => {
      console.log(err);
      this.isAddLoading = false;
    });
  }

  searchDevice() {
    $(".device-found").hide();
    $(".device-found-add").hide();
    $(".device-not-found").hide();
    let deviceId = $("#device-search-input").val();
    this.devicesService.searchDevice(deviceId).catch((error) => {
      $(".device-not-found").show();
      console.error(error.message || error);
      return Observable.throw(error.message || error);
    }).subscribe((res) => {
      let device = JSON5.parse(res._body).body;
      if (device) {
        $(".device-found").css("display", "flex");
        $(".device-found-add").show();
      } else {
        $(".device-not-found").show();
      }
    }, (err) => {
      console.log(err);
    });
  }

  /** Auto update temp */

  setUpAutoUpdateTemp() {
    for (let i = 0; i < this.intervals.length; i++) {
      let interval = this.intervals[i];
      clearInterval(interval);
    }
    this.intervals = [];
    for (let i = 0; i < this.devices.length; i++) {
      let device = this.devices[i];
      // Run once
      if (device.lastUpdate) device.lastUpdate.unsubscribe();
      this.updateTemp(device);
      // Run every 5 seconds
      if (device.interval) clearInterval(device.interval);
      device.interval = setInterval(() => {
        if (device.lastUpdate) device.lastUpdate.unsubscribe();
        this.updateTemp(device);
      }, 5 * 60 * 1000);
      this.intervals.push(device.interval);
    }
  }

  updateTemp(device: any) {
    device.lastUpdate = this.devicesService.getCurrentDeviceDatalog(device.id).subscribe((res) => {
      let timeArr = JSON5.parse(res._body).body;
      if (!timeArr || !timeArr[0]) return;
      device.currentStats = timeArr[0].temperature;
    });
  }
}
