import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccountService } from '../accountService.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers:[MessageService]
})
export class HomePageComponent implements OnInit {

  loggedInUser: any;
  posts: [];
  students: [];
  allposts:any;
  allStudents:any;
  selectedposts:any;
  allUsers: any;
  constructor(private messageService : MessageService,private router : Router,
    private accountService : AccountService)
  {

  }
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user')!) || [];
    this.allposts = JSON.parse(localStorage.getItem('Posts')!) || [];
    this.allUsers = JSON.parse(localStorage.getItem('Users')!) || [];

    this.selectedposts=[];
    if(this.loggedInUser.userType == 'employer')
    {
    this.allposts.forEach((elem:any)=>{

      if(elem.id == this.loggedInUser.id)
      {
        this.selectedposts.push(elem);
      }

    })

    this.allStudents = [];

    this.allUsers.forEach((elem:any)=>{


      if(elem.userType == "student")
      {
        this.allStudents.push(elem);
      }
    })
  }








  }

  deletePost(id:any)
  {
    this.allposts.forEach((elem:any)=>{

      if(elem.postId == id)
      {
        let posts = this.allposts.filter((x:any) => x.postId !== id);
        localStorage.removeItem('Posts');
            localStorage.setItem('Posts', JSON.stringify(posts));
            this.messageService.add({ severity: 'success', summary: 'Post deleted successfully' });

            this.ngOnInit();
      }

    })
  }
  editJob(id:any)
  {
    this.router.navigate(['/editPost',id]);
  }

  applyJob(data:any)
  {

    if(!data.userId)
    {
    let obj ={
      'userId':this.loggedInUser.id,
      ...data
    }
    this.accountService.updatePost(data.postId,obj);
    this.ngOnInit();
    this.messageService.add({ severity: 'success', summary: 'Your application has been sent to the employer' });
  }
  else{
    this.messageService.add({ severity: 'success', summary: 'Your application has already been sent to the employer' });

  }
  }
}
