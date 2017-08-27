import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { LocationService } from '../../services/location.service';

//Jquery
declare var $: any;

@Component({
  selector: 'location-tabs-component',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.css']
})

export class LocationTabsComponent implements OnInit {
  // This location
  location: any;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: LocationService,
    private translate: TranslateService
  ) { }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.title.setTitle("Device details");
    this.route.params.subscribe((params) => {
      this.deviceService.getLocation(params.id).subscribe((location) => {
        this.location = location;
      });
    });
  }

  ngAfterViewInit() {
  }

  backToLocations() {
    this.router.navigate(["tabs/locations"]);
  }

}
