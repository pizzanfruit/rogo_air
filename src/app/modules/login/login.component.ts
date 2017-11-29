import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { LoginService } from '../../services/login.service';
import { TranslateService } from '@ngx-translate/core';

//Jquery
declare var $: any;
declare var classie: any;

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  //
  userName: any;
  password: any;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle("Login");
    this.resetBody();
  }

  resetBody() {
    $('html').css('font-size', '100%');
  }

  authenticate() {
    if (!this.userName || !this.password) return;
    this.isLoading = true;
    this.disableLogin();
    this.loginService.login(this.userName, this.password, () => {
      this.isLoading = false;
      this.enableLogin();
    });
  }

  disableLogin() {
    $(".login-button").addClass("disabled");
    $(".login-button").attr("disabled", true);
  }

  enableLogin() {
    $(".login-button").removeClass("disabled");
    $(".login-button").attr("disabled", false);
  }

  keyDownFunction(event) {
    // Enter key
    if (event.keyCode == 13) {
      this.authenticate();
    }
  }
}