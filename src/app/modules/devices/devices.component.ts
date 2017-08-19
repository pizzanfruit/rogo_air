import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//Jquery
declare var $: any;

@Component({
  selector: 'devices-component',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})

export class DevicesComponent implements OnInit {

  devices: any[] = [
    {mac:"1", name: "Rogo Air 1", location: "FPT Shop tiểu khu Mỹ Lâm", temp: "29", humidity: "65", status: "Running"},
    {mac:"2", name: "Rogo Air 2", location: "FPT Shop tiểu khu Mỹ Lâm", temp: "29", humidity: "65", status: "Running"},
    {mac:"3", name: "Rogo Air 3", location: "FPT Shop tiểu khu Mỹ Lâm", temp: "29", humidity: "65", status: "Stopped"},
  ];

  constructor(
    private title: Title,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle("Devices");
  }

  selectDevice(mac: number) {
    this.router.navigate(["tabs/devices", mac]);
  }

}
