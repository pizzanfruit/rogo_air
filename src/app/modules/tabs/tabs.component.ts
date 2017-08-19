import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LoginService } from '../../services/login.service';

//Jquery
declare var $: any;

@Component({
  selector: 'tabs-component',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css', './css/bootstrap.min.css']
})

export class TabsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Emulate 3s loading time
    setTimeout(() => {
      this.hideLoading();
    }, 3000);
  }

  hideLoading() {
    $(".loading").hide();
  }

  switchTab(event) {
    let img = $(event.target);
    if (img.hasClass("active")) return;
    img.addClass("active");
  }
}
