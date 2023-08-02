import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../accountService.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent {
  postData: any;

  usersData: any = [];

  constructor(private router: Router, private accountService: AccountService) {



    this.setData();

  }

  setData() {

    let posts = JSON.parse(localStorage.getItem('Posts')!);

    let postData1 = JSON.parse(localStorage.getItem('currentPost')!);

    this.usersData = [];
    this.postData = posts.find((x: any) => x.postId == postData1.postId);

    let users = JSON.parse(localStorage.getItem("Users")!);
    if (this.postData.userId.length > 0) {
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




    this.sendSms(data.phoneNumber, flag)



    let post = JSON.parse(localStorage.getItem('Posts')!);
    post.forEach((elem: any) => {
      let count1 = 0;
      if (elem.userId && elem.userId.length > 0) {

        let obj: { userId: any; isAccepted: boolean; }[] = [];
        let count = 0;
        elem.userId.forEach((element: any) => {

          if (element.userId == data.id) {
            post[count1].userId[count].isAccepted = flag
          }

          count++;

        });

        count1++;



        localStorage.setItem('Posts', JSON.stringify(post));
        this.setData();
      }
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
      localStorage.setItem("notification", JSON.stringify(previous));


    }
    // const index = this.usersData.indexOf(data);
    //   if (index > -1) { // only splice array when item is found
    //     this.usersData.splice(index, 1); // 2nd parameter means remove one item only
    //   }


    // this.getStatus();
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
