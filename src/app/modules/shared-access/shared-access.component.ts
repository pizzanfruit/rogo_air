import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { SharedAccessService } from '../../services/shared-access.service'

//Jquery
declare var $: any;

@Component({
  selector: 'shared-access-component',
  templateUrl: './shared-access.component.html',
  styleUrls: ['./shared-access.component.css']
})

export class SharedAccessComponent implements OnInit {

  //
  isLoading: boolean = true;
  // Master data
  users: any;
  roles: string[] = ["READ", "CONTROL", "MANAGE", "ADMIN"];

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private sharedAccessService: SharedAccessService
  ) { }

  ngOnInit() {
    this.title.setTitle("Shared access");
    this.getMasterData(this.setUpEditPopup.bind(this));
  }

  getMasterData(onComplete?) {
    this.route.params.subscribe((params) => {
      this.sharedAccessService.getUsers(params.id).subscribe(users => {
        this.users = users;
        this.isLoading = false;
        if (onComplete) onComplete();
      }, err => {
        this.isLoading = false;
      });
    });
  }

  backToLocations() {
    this.router.navigate(["tabs/locations"]);
  }

  selectDevice(mac: number) {
    this.router.navigate(["tabs/devices", mac]);
  }

  getRandomColor() {
    var hex = Math.floor(Math.random() * 0xFFFFFF);
    return "#" + ("000000" + hex.toString(16)).substr(-6);
  }

  /** Role select */
  selectRole() {
    console.log("ROLE !!!");
  }

  /** Edit popup */

  setUpEditPopup() {
    $(document).mouseup(function (e) {
      var container = $(".edit-popup, .action-button-icon");
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".edit-popup").hide();
      }
    });
  }

  toggleEditPopup(event) {
    let display = $(event.target).next().css("display");
    $(".edit-popup").hide();
    if (display == "none") {
      $(event.target).next().show();
      $(event.target).next().focus();
    }
  }

  closeEditPopup(event) {
    $(event.target).parent().hide();
  }


}
