import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  selected: boolean;
  loggedInUser: any;
  userNotifications: any=[];

  constructor(private router : Router ,private location : Location)
  {

  }

  ngOnInit(): void {

    let notificationData = JSON.parse(localStorage.getItem("notification")!);

    this.loggedInUser = JSON.parse(localStorage.getItem("user")!);

    notificationData.forEach((element:any) => {

      if(element.id == this.loggedInUser.id)
      {
        this.userNotifications.push(element);
      }
    });

  }
  toggle() {
    this.selected = false;
    this.location.back();
  }
}
