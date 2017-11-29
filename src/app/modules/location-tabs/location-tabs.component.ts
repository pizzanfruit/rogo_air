import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { TranslateService } from "@ngx-translate/core";

import { AuthService } from "../../services/auth.service";
import { LocationsService } from "../../services/locations.service";

//Jquery
declare var $: any;
// JSON5
var JSON5 = require("json5");

@Component({
  selector: "location-tabs-component",
  templateUrl: "./location-tabs.component.html",
  styleUrls: ["./location-tabs.component.css"]
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
    private locationsService: LocationsService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.isLoading = true;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.title.setTitle("Device details");
    this.route.params.subscribe(params => {
      this.locationsService.getLocation(params.id).subscribe(
        res => {
          this.location = JSON5.parse(res._body).body;
          this.isLoading = false;
          setTimeout(() => this.setUpProfilePopup());
        },
        err => {
          this.isLoading = false;
        }
      );
    });
  }

  ngAfterViewInit() {}

  backToLocations() {
    this.router.navigate(["tabs/locations"]);
  }

  /** Edit popup */

  setUpProfilePopup() {
    $(".location-tabs-wrapper").mouseup(function(e) {
      var container = $(".profile-popup, .hello-text");
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".profile-popup").hide();
      }
    });
  }

  toggleProfilePopup() {
    let display = $(".profile-popup").css("display");
    if (display == "none") {
      $(".profile-popup").show();
      $(".profile-popup").focus();
    } else {
      $(".profile-popup").hide();
    }
  }

  closeProfilePopup(event) {
    $(event.target)
      .parent()
      .hide();
  }

  // User session
  logout() {
    this.authService.logout();
  }

  signup() {
    this.router.navigate(["/signup"]);
  }
}
