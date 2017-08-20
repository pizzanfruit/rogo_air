import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LoginService } from '../../services/login.service';

//Jquery
declare var $: any;

@Component({
  selector: 'tabs-component',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Emulate 3.5s loading time
    setTimeout(() => {
      this.hideLoading();
    }, 3500);
  }

  ngAfterViewInit() {
    this.doResize();
  }

  doResize() {
    // FONT SIZE
    var ww = $('body').width();
    var maxW = 2560;
    ww = Math.min(ww, maxW);
    var fw = ww * (10 / maxW);
    var fpc = fw * 100 / 16;
    var fpc = Math.round(fpc * 100) / 100;
    var fpc = fpc * 2;
    $('html').css('font-size', fpc + '%');
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
