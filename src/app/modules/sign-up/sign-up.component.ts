import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { NgSwitch } from "@angular/common";

import { SignUpService } from "../../services/sign-up.service";
import { TranslateService } from "@ngx-translate/core";

//Jquery
declare var $: any;
declare var classie: any;

@Component({
  selector: "sign-up-component",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"]
})
export class SignUpComponent implements OnInit {
  //
  isLoading: boolean = false;
  // 0 : register
  // 1 : confirm
  // 2 : result
  stepCode: number = 0;
  // Register
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  // Confirm
  code: string;

  constructor(
    private signUpService: SignUpService,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Sign up");
  }

  handleSubmitEvent() {
    if (this.stepCode == 0) this.signUp();
    else if (this.stepCode == 1) this.confirmUser();
    else this.confirmResult();
  }

  signUp() {
    if (!this.username || !this.password || !this.email) return;
    this.isLoading = true;
    this.disableSignUp();
    this.signUpService.signUp(this.username, this.password, this.email, res => {
      this.isLoading = false;
      this.enableSignUp();
      if (res) this.stepCode = 1;
    });
  }

  disableSignUp() {
    $(".sign-up-button").addClass("disabled");
    $(".sign-up-button").attr("disabled", true);
  }

  enableSignUp() {
    $(".sign-up-button").removeClass("disabled");
    $(".sign-up-button").attr("disabled", false);
  }

  keyDownFunction(event) {
    // Enter key
    if (event.keyCode == 13) {
      this.signUp();
    }
  }

  /** Confirm user */

  confirmUser() {
    if (!this.code) return;
    this.isLoading = true;
    this.disableConfirm();
    this.signUpService.confirmUser(this.username, this.code, (res) => {
      this.isLoading = false;
      this.enableConfirm();
      if (res) this.stepCode = 2;
    });
  }

  disableConfirm() {
    $(".confirm-button").addClass("disabled");
    $(".confirm-button").attr("disabled", true);
  }

  enableConfirm() {
    $(".confirm-button").removeClass("disabled");
    $(".confirm-button").attr("disabled", false);
  }

  /** Confirm result */

  confirmResult() {
    this.router.navigate(["login"]);
  }
}
