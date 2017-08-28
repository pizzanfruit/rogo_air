import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LocationsService } from '../../services/locations.service';
import { Observable } from 'rxjs';

import { AgmMap } from "@agm/core"
// Jquery
declare var $: any;
// JSON5
var JSON5 = require('json5');

@Component({
  selector: 'locations-component',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})

export class LocationsComponent implements OnInit {
  @ViewChild(AgmMap) myMap: any;
  window = window;
  //
  isLoading: boolean = true;
  // Master data
  locations: any[];
  cities: any[] = [
    {
      name: "Hà Nội", districts: [
        "Đống Đa", "Cầu Giấy", "Tây Hồ", "Thạch Thất", "Trương Định"
      ]
    },
    {
      name: "Hồ Chí Minh", districts: [
        "Quận 1", "Thủ Đức", "Bình Thạnh", "Tân Bình", "Trương Định"
      ]
    },
    {
      name: "Đà Nẵng", districts: [
        "Đống Đa", "Cầu Giấy", "Tây Hồ", "Thạch Thất", "Tân Phú", "Phú Nhuận"
      ]
    },
  ]
  districts: any[] = [];
  filteredItemsByName: any[];
  filteredItemsByCity: any[];
  filteredItemsByDistrict: any[];
  // Selected
  selectedCity: any = "none";
  selectedDistrict: any = "none";
  //
  // results: any[] = [
  //   { id: "1", name: "FPT shop tiểu khu Mỹ lâm", city: "Hà Nội" },
  //   { id: "2", name: "FPT shop Đống Đa", city: "Hồ Chí Minh" }
  // ];
  lat: number = 20.98401;
  lng: number = 105.846282;

  constructor(
    private title: Title,
    private locationsService: LocationsService,
    private router: Router
  ) {
    this.isLoading = true;
  }

  scale1() {
    $("input+.underline").css("transform", "scale(1)");
  }

  scale0() {
    $("input+.underline").css("transform", "scale(0)");
  }

  ngOnInit() {
    this.title.setTitle("Locations");
    this.getMasterData();
  }

  getMasterData() {
    this.locationsService.getLocations("9dc9496c7bf111e7bb31be2e44b06b34").subscribe((res) => {
      this.locations = JSON5.parse(res._body).body;
      this.assignCopy();
      let latSum = 0;
      let longSum = 0;
      let length = this.filteredItemsByDistrict.length;
      this.isLoading = false;
      if (length <= 0) return;
      for (let i = 0; i < length; i++) {
        let coordinates = JSON.parse(this.filteredItemsByDistrict[i].coordinate);
        latSum += parseFloat(coordinates[0]);
        longSum += parseFloat(coordinates[1]);
      }
      this.lat = latSum / length;
      this.lng = longSum / length;
    }, (err) => {
      console.log(err);
      this.isLoading = false;
    })
  }

  selectLocation(id) {
    this.router.navigate(["tabs/locations", id])
  }

  assignCopy() {
    this.filteredItemsByName = Object.assign([], this.locations);
    this.filteredItemsByCity = Object.assign([], this.locations);
    this.filteredItemsByDistrict = Object.assign([], this.locations);
  }

  filterItemName() {
    let value = $("#search-input").val();
    if (!value) {
      this.filteredItemsByName = Object.assign([], this.locations);
      return;
    }
    this.filteredItemsByName = Object.assign([], this.locations).filter(
      item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  filterItemCity() {
    let value = $("#city-select").val();
    if (value == "none") {
      this.districts = [];
    } else {
      this.districts = this.cities.find(it => it.name == value).districts;
    }
    if (!value || value == "none") {
      this.filteredItemsByCity = Object.assign([], this.filteredItemsByName);
      return;
    }
    this.filteredItemsByCity = Object.assign([], this.filteredItemsByName).filter(
      item => item.address.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  filterItemDistrict() {
    let value = $("#district-select").val();
    if (!value || value == "none") {
      this.filteredItemsByDistrict = Object.assign([], this.filteredItemsByCity);
      return;
    }
    this.filteredItemsByDistrict = Object.assign([], this.filteredItemsByCity).filter(
      item => item.address.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  filter() {
    this.filterItemName();
    this.filterItemCity();
    this.filterItemDistrict();
    let latSum = 0;
    let longSum = 0;
    let length = this.filteredItemsByDistrict.length;
    if (length <= 0) return;
    for (let i = 0; i < length; i++) {
      let coordinates = JSON.parse(this.filteredItemsByDistrict[i].coordinate);
      latSum += parseFloat(coordinates[0]);
      longSum += parseFloat(coordinates[1]);
    }
    this.lat = latSum / length;
    this.lng = longSum / length;
  }
}
