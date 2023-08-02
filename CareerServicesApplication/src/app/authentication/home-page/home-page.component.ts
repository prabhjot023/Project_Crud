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
  displayStyle="none";
  selctedJob: any;
  constructor(private messageService : MessageService,private router : Router,
    private accountService : AccountService)
  {

  }
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user')!) || [];
    this.allposts = JSON.parse(localStorage.getItem('Posts')!) || [];
    this.allUsers = JSON.parse(localStorage.getItem('Users')!) || [];

    this.selectedposts=[];
    if(this.loggedInUser.userType == 'employer' ||  this.loggedInUser.userType == 'admin')
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

  else{

    let index =0;
    this.allposts.forEach((elem:any)=>{



      if(elem.userId.length>0)
      {
        if(elem.userId.find((x:any) => x.userId === this.loggedInUser.id))
        {

          let obj ={
            'isApplied' :true,
            ...elem
          }
          this.allposts[index] = obj;

        }

      }
      index++;
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


  deleteStudent(id:any)
  {
    this.allUsers.forEach((elem:any)=>{

      if(elem.id == id)
      {
        let students = this.allUsers.filter((x:any) => x.id !== id);
        localStorage.removeItem('Users');
            localStorage.setItem('Users', JSON.stringify(students));
            this.messageService.add({ severity: 'success', summary: 'Student deleted successfully' });

            this.ngOnInit();
      }

    })
  }


  editJob(id:any)
  {
    this.router.navigate(['/editPost',id]);
  }

  applyJob(data:any,type:any)
  {

    if(!data.isApplied)
    {

      let users = JSON.parse(localStorage.getItem("Users")!);
      if (users.find((x: any) => x.id === this.loggedInUser.id)) {


        if(type == 1)
        {

        if (localStorage.getItem("uploadedResumes")) {
          let resumes: any;
          resumes = (localStorage.getItem('uploadedResumes'));
          resumes = JSON.parse(resumes);
          resumes.forEach((element: any) => {


            if (element.id == this.loggedInUser.id) {

              data.userId.push({
                'isAccepted':null,
                'userId':this.loggedInUser.id,
                'type':type

              })
              this.accountService.updatePost(data.postId,data);
              this.closePopup();

              this.messageService.add({ severity: 'success', summary: 'Your application has been sent to the employer' });
            }
            else{
              this.messageService.add({ severity: 'warn', summary: 'Please upload your resume first' });

            }
        })
      }
    }

    if(type == 0)
    {
      if (localStorage.getItem("Resumes")) {
        let resumes: any;
        resumes = (localStorage.getItem('Resumes'));
        resumes = JSON.parse(resumes);
        resumes.forEach((element: any) => {


          if (element.id == this.loggedInUser.id) {

            data.userId.push({
              'isAccepted':null,
              'userId':this.loggedInUser.id,
              'type':type

            })
            this.accountService.updatePost(data.postId,data);

            this.closePopup();
            this.messageService.add({ severity: 'success', summary: 'Your application has been sent to the employer' });
          }
          else{
            this.messageService.add({ severity: 'warn', summary: 'Please build your resume first' });

          }
      })
    }
    }
    }


  }
  else{

    this.messageService.add({ severity: 'success', summary: 'Your application has already been sent to the employer' });

  }
  this.ngOnInit();
  }

  redirectToPost(data:any)
  {

    localStorage.setItem('currentPost',JSON.stringify(data));

    this.router.navigate(['/postpage'])
  }


  openPopup(data:any) {
    this.displayStyle = "block";
    this.selctedJob = data;
  }
  closePopup() {
    this.displayStyle = "none";
  }
}
