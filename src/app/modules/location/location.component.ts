import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LocationService } from '../../services/location.service'

//Jquery
declare var $: any;

@Component({
  selector: 'location-component',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})

export class LocationComponent implements OnInit {

  //
  location: any;
  devices: any[] = [
    { mac: "1", name: "Rogo Air 1", location: "FPT Shop tiểu khu Mỹ Lâm", temp: "29", humidity: "65", status: "Running" },
    { mac: "2", name: "Rogo Air 2", location: "FPT Shop tiểu khu Mỹ Lâm", temp: "29", humidity: "65", status: "Running" },
    { mac: "3", name: "Rogo Air 3", location: "FPT Shop tiểu khu Mỹ Lâm", temp: "29", humidity: "65", status: "Stopped" },
  ];

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.title.setTitle("Location details");
    this.route.params.subscribe((params) => {
      this.locationService.getLocation(params.id).subscribe((location) => {
        this.location = location;
      });
    });
  }

  backToLocations() {
    this.router.navigate(["tabs/locations"]);
  }

  selectDevice(mac: number) {
    this.router.navigate(["tabs/devices", mac]);
  }

}
