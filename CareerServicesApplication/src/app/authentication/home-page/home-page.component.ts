import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  loggedInUser: any;
  posts: [];
  students: [];
  allposts:any;
  allStudents: [];
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user')!) || [];
    this.allposts = JSON.parse(localStorage.getItem('Posts')!) || [];
    this.allStudents = JSON.parse(localStorage.getItem('Users')!) || [];


  }
}
