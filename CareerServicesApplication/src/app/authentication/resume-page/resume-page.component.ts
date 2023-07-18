import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../accountService.service';
import { first } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resume-page',
  templateUrl: './resume-page.component.html',
  styleUrls: ['./resume-page.component.scss'],
  providers:[MessageService]
})
export class ResumePageComponent implements OnInit {
  resumeBuilderForm: FormGroup;
  loggedInUser: any;
  loggedInUserResume: any;
  selected: boolean;
  resumeTypeBuild: boolean;
  submitted: boolean;
  
  constructor(private formBuilder: FormBuilder,private accountService : AccountService,
    private messageService : MessageService,private router : Router,private route : ActivatedRoute) {
    this.loggedInUser= JSON.parse(localStorage.getItem('user')!) || [];

    let resume= JSON.parse(localStorage.getItem('Resumes')!) || [];
    this.loggedInUserResume = resume.find((x:any) => x.id === this.loggedInUser.id);

  }

  ngOnInit(): void {
    this.resumeBuilderForm = this.formBuilder.group({
      firstName: [this.loggedInUser.firstName ||''  , Validators.required],
      lastName: [this.loggedInUser.lastName|| '', Validators.required],
      email: [this.loggedInUser.username || '', [Validators.email,Validators.required]],
      phone:[this.loggedInUserResume? this.loggedInUser.phone : ''] ,
      experienceBlocks: this.formBuilder.array([this.buildExperienceBlock()]),
      education: this.formBuilder.array([this.educations()]),
      id:this.loggedInUser.id

    });
  }

  buildExperienceBlock(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  educations(): FormGroup {
    return this.formBuilder.group({
      level_of_education: ['', [Validators.required]],
      school_name: ['', [Validators.required]],
      field: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],

    });
  }
  save() {
    this.submitted = true;
    console.log(this.resumeBuilderForm);


    if (this.resumeBuilderForm.invalid) {
      return;
    }

    this.accountService.addResume(this.resumeBuilderForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.messageService.clear();
          this.messageService.add({ severity: 'success', summary: 'Success' });
          //this.router.navigate(['/'], { relativeTo: this.route });
        },
        error: error => {
          this.messageService.add({  severity: 'warn', summary: 'This email is already registered, Please Login',});
        }
      });
  }

  get experienceBlocks(): FormArray {
    return this.resumeBuilderForm.get('experienceBlocks') as FormArray;
  }

  get education(): FormArray {
    return this.resumeBuilderForm.get('education') as FormArray;
  }


  addExperience() {
    this.experienceBlocks.insert(0, this.buildExperienceBlock());
  }

  removeExperience(index:any)
  {
    let formArray = this.resumeBuilderForm.get('experienceBlocks') as FormArray;
    formArray.removeAt(index);

  }
  addEducation() {
    this.education.insert(0, this.educations());
  }
  removeEducation(index:any)
  {
    let formArray = this.resumeBuilderForm.get('education') as FormArray;
    formArray.removeAt(index);

  }
  setResumeType(flag:Boolean)
  {

    this.selected = true;
  if(flag)
  {
    this.resumeTypeBuild = true;
  }
  else{
    this.resumeTypeBuild = false;

  }
  }
  toggle()
  {
    this.selected =false;
  }
//   showDoc(obj){
//     if(!(obj.img == constants.dummyDocImage) || (obj.img == constants.spinnerUrl)){
//         window.open(obj.val, '_blank');
//     }
// }

onDocumentSelect(event:any) {
  if (event.target.files[0]) {
      const File = event.target.files;

  }

}
}
