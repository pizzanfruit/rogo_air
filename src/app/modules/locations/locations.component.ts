import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LocationsService } from '../../services/locations.service';
import { Observable } from 'rxjs';
//Jquery
declare var $: any;

@Component({
  selector: 'locations-component',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})

export class LocationsComponent implements OnInit {
  // Master data
  cities: any[];
  districts: any[];
  // Selected
  selectedCity: any;
  selectedDistrict: any;
  //
  results: any[] = [
    {id: "1", name: "FPT shop tiểu khu Mỹ lâm", city: "Hà Nội"},
    {id: "2", name: "FPT shop Đống Đa", city: "Hồ Chí Minh"}
  ];
  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(
    private title: Title,
    private locationsService: LocationsService,
    private router: Router
  ) { }

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
    Observable.forkJoin(
      // res[0]
      this.locationsService.getCities(),
      // res[1]
      this.locationsService.getDistricts()
    ).subscribe(res => {
      this.cities = res[0];
      this.districts = res[1];
      this.selectedCity = "Toàn quốc";
      this.selectedDistrict = "Tất cả quận huyện"
    });
  }

  selectLocation(id) {
    this.router.navigate(["tabs/locations", id])
  }
}
