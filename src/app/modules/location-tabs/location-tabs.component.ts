import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { LocationService } from '../../services/location.service';

//Jquery
declare var $: any;
// JSON5
var JSON5 = require('json5');

@Component({
  selector: 'location-tabs-component',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.css']
})

export class LocationTabsComponent implements OnInit {
  // This location
  location: any;

  //
  isLoading: boolean = true;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: LocationService,
    private translate: TranslateService
  ) {
    this.isLoading = true;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.title.setTitle("Device details");
    this.route.params.subscribe((params) => {
      this.deviceService.getLocation(params.id).subscribe((res) => {
        this.location = JSON5.parse(res._body).body;
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
      });
    });
  }

  ngAfterViewInit() {
  }

  backToLocations() {
    this.router.navigate(["tabs/locations"]);
  }

}
