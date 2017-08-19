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
    // Emulate 3.5s loading time
    setTimeout(() => {
      this.hideLoading();
    }, 3500);
  }

  hideLoading() {
    $(".loading").css('opacity', 0);
    setTimeout(() => {
      $(".loading").hide();
    }, 1000);
  }

  switchTab(event) {
    let img = $(event.target);
    if (img.hasClass("active")) return;
    img.addClass("active");
  }
}
