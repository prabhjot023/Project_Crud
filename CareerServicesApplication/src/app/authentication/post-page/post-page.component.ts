import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../accountService.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  providers:[MessageService]
})
export class PostPageComponent {
  postData: any;

  usersData: any = [];
  loggedInUser;

  constructor(private router: Router, private accountService: AccountService,
    private messageService : MessageService) {



    this.setData();

    this.loggedInUser = JSON.parse(localStorage.getItem('user')!);
  }

  setData() {

    let posts = JSON.parse(localStorage.getItem('Posts')!);

    let postData1 = JSON.parse(localStorage.getItem('currentPost')!);

    this.usersData = [];
    this.postData = posts.find((x: any) => x.postId == postData1.postId);

    let users = JSON.parse(localStorage.getItem("Users")!);
    if (this.postData.userId && this.postData.userId.length > 0) {
      this.postData.userId.forEach((elem: any) => {

        let oj = users.find((x: any) => x.id == elem.userId);
        oj.isAccepted = elem.isAccepted;
        if (elem.type == 0) {
          oj.resumeType = 'form';

        }
        if (elem.type == 1) {
          oj.resumeType = 'upload';

        }
        this.usersData.push(oj);


      })
      console.log(this.usersData);
    }
  }

  viewResume(data: any) {

    if (data.resumeType == 'upload'
    ) {
      let users = JSON.parse(localStorage.getItem("Users")!);
      if (users.find((x: any) => x.id === data.id)) {

        let user = users.find((x: any) => x.id === data.id);


        if (localStorage.getItem("uploadedResumes")) {


          const downloadLink = document.createElement("a");
          let resumes: any;
          resumes = (localStorage.getItem('uploadedResumes'));
          resumes = JSON.parse(resumes);
          resumes.forEach((element: any) => {


            if (element.id == data.id) {

              downloadLink.href = element.resumeLink;
              downloadLink.download = element.name;
              downloadLink.click();
            }
          });
        }
      }

    }
    else{

      this.router.navigate(['/viewResume',data.id]);



    }


  }

  sendNotification(data: any, flag: boolean) {

    //this.sendSms();



    if(this.loggedInUser.userType == "admin")
    {
      this.messageService.add({  severity: 'warn', summary: 'Access denied to perform this action'});

    }
    else{






    let post = JSON.parse(localStorage.getItem('Posts')!);
    let indexToUpdate =post.findIndex((item:any) => item.postId == this.postData.postId);

    post.forEach((elem: any) => {
      let count1 = 0;
      if(elem.postId == this.postData.postId)
      {
      if (elem.userId && elem.userId.length > 0) {

        let count = 0;
        elem.userId.forEach((item: any) => {

          if (item.userId == data.id) {
            post[indexToUpdate].userId[count].isAccepted = flag
          }

          count++;

        });




        localStorage.setItem('Posts', JSON.stringify(post));
        this.setData();
      }
    }

    count1++;
    })



    if (localStorage.getItem("notification")) {

      let previousData = [];
      let newData = JSON.parse(localStorage.getItem("notification")!);
      newData.forEach((elem: any) => {
        previousData.push(elem);
      })

      let obj = {
        'companyName': this.postData.companyName,
        'id': data.id,
        'job_title': this.postData.job_title,
        'isAccepted': flag,

      }


      previousData.push(obj)

      this.messageService.add({  severity: 'success', summary: 'Success'});

      localStorage.setItem("notification", JSON.stringify(previousData));




    }
    else {
      let previous = [];
      let obj = {
        'companyName': this.postData.companyName,
        'id': data.id,
        'job_title': this.postData.job_title,

        'isAccepted': flag
      }

      previous.push(obj);
      this.messageService.add({  severity: 'success', summary: 'Success'});

      localStorage.setItem("notification", JSON.stringify(previous));


    }
    // const index = this.usersData.indexOf(data);
    //   if (index > -1) { // only splice array when item is found
    //     this.usersData.splice(index, 1); // 2nd parameter means remove one item only
    //   }


    // this.getStatus();

    this.sendSms(data.phoneNumber, flag)
  }

  }
  // getStatus()
  // {
  //   let notificationData = JSON.parse(localStorage.getItem("notification")!);

  //   notificationData.forEach((elem:any)=>{

  //     if(elem.isAccepted)
  //     {

  //       this.usersData.find((x:any)=>x.id == elem.id);

  //     }


  //   })

  // }


  sendSms(phone: any, flag: boolean) {


    if (flag) {

      let string = 'Your application has been accepted by ' + this.postData.companyName + ' for ' + this.postData.job_title;
      this.accountService.sendMessage(phone.toString(), string);
    }
    else {
      let string = this.postData.companyName + ' is not moving forward with your job application for ' + this.postData.job_title;

      this.accountService.sendMessage(phone.toString(), string);

    }


  }
}
