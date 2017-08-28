import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
  isRemoveLoading: boolean = false;
  filteredItems: any[] = [];

  //
  parentId: any;

  devices: any[];

  filters: any[] = [
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
    this.isAddLoading = false;
  }

  ngOnInit() {
    this.title.setTitle("Devices");
    this.refreshDevices();
    this.setUpEditPopup();
  }

  refreshDevices() {
    this.route.parent.params.subscribe((params) => {
      this.parentId = params['id'];
      this.devicesService.getDevices(this.parentId).subscribe((res) => {
        this.devices = JSON5.parse(res._body).body;
        this.assignCopy();
        this.isLoading = false;
        this.isAddLoading = false;
      }, (err) => {
        console.log(err);
        this.isLoading = false;
        this.isAddLoading = false;
      });
    });
  }

  setUpEditPopup() {
    $(document).mouseup(function (e) {
      var container = $(".edit-popup");
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
  }

  selectDevice(deviceId: number) {
    this.router.navigate(["../devices", deviceId], { relativeTo: this.route });
  }

  openEditPopup(event) {
    $(".edit-popup").hide();
    $(event.target).next().show();
    $(event.target).next().focus();
  }

  closeEditPopup(event) {
    $(event.target).parent().hide();
  }

  removeDevice(id, event) {
    setTimeout(() => {
      $(".remove-loading-icon[id='" + id + "']").show();
    })
    this.devicesService.deleteDevice(this.parentId, id).subscribe((res) => {
      this.refreshDevices();
    }, (err) => {
      console.log(err);
    })
    this.closeEditPopup(event);
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
    this.filteredItems = Object.assign([], this.devices);
  }

  filterItem() {
    let value = $("#filter-select").val();
    console.log(value);
    switch (value) {
      case "0":
        this.filteredItems = Object.assign([], this.devices);
        break;
      case "1":
        this.filteredItems = Object.assign([], this.devices).filter(
          item => item.type.toLowerCase().indexOf("rogoair") > -1
        )
        break;
      case "2":
        console.log("JJKLJLKJKL");
        this.filteredItems = Object.assign([], this.devices).filter(
          item => item.type.toLowerCase().indexOf("rogosalon") > -1
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
      console.log($(".device-not-found"));
      $(".device-not-found").show();
      console.error(error.message || error);
      return Observable.throw(error.message || error);
    }).subscribe((res) => {
      let device = JSON5.parse(res._body).body;
      if (device) {
        $(".device-found").css("display", "flex");
        $(".device-found-add").show();
      } else {
        console.log("asjdlka");
        console.log($(".device-not-found"));
        $(".device-not-found").show();
      }
    }, (err) => {
      console.log(err);
    });
  }
}
