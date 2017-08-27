import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { DevicesService } from '../../services/devices.service';

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

  devices: any[];

  filters: any[] = [
    { name: "Tất cả", value: 0 },
    { name: "Rogo Air", value: 1 },
    { name: "Rogo Salon", value: 2 }
  ]

  selectedFilter: number = 0;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private devicesService: DevicesService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.title.setTitle("Devices");
    this.route.parent.params.subscribe((params) => {
      let id = params['id'];
      this.devicesService.getDevices(id).subscribe((res) => {
        this.devices = JSON5.parse(res._body).body;
        this.isLoading = false;
      }, (err) => {
        console.log(err);
        this.isLoading = false;
      });
    });
  }

  selectDevice(deviceId: number) {
    this.router.navigate(["../devices", deviceId], { relativeTo: this.route });
  }

  openEditPopup(event) {
    $(".edit-popup").hide();
    $(event.target).next().show();
  }

  closeEditPopup(event) {
    $(event.target).parent().hide();
  }

  openAddDeviceModal() {
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

}
