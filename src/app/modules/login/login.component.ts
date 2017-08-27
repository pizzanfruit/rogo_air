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
  styleUrls: ['./login.component.css', './normalize.css']
})

export class LoginComponent implements OnInit {

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

  ngAfterViewInit() {
    this.setUpInput();
  }

  authenticate() {
    if (this.userName === "rogoair" && this.password === "123456") {
      this.router.navigate(["/tabs"]);
    }
  }

  setUpInput() {
    (function () {
      // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
      if (!String.prototype.trim) {
        (function () {
          // Make sure we trim BOM and NBSP
          var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
          String.prototype.trim = function () {
            return this.replace(rtrim, '');
          };
        })();
      }

      [].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
          classie.add(inputEl.parentNode, 'input--filled');
        }

        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
      });

      function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
      }

      function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
          classie.remove(ev.target.parentNode, 'input--filled');
        }
      }
    })();
  }

  keyDownFunction(event) {
    // Enter key
    if (event.keyCode == 13) {
      this.authenticate();
    }
  }
}