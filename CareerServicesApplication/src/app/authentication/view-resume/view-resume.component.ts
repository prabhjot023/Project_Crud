import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-resume',
  templateUrl: './view-resume.component.html',
  styleUrls: ['./view-resume.component.scss']
})
export class ViewResumeComponent implements OnInit{
  resumeBuilderForm: any;
  loggedInUserResume: any;
  loggedInUser: any;

  expArrForm: FormGroup[] = [];
  eduArrForm: FormGroup[] = [];
  constructor(private formBuilder : FormBuilder,private route : ActivatedRoute,
    private location : Location)
  {

  }

  ngOnInit(): void {
      let resume = JSON.parse(localStorage.getItem('Resumes')!) || [];

      this.route.params.subscribe(params => {
        console.log(params) //log the entire params object
        this.loggedInUser = params['id'] //log the value of id
      });
    this.loggedInUserResume = resume.find((x: any) => x.id == this.loggedInUser);

    this.resumeBuilderForm = this.formBuilder.group({
      firstName: [this.loggedInUserResume?.firstName || this.loggedInUser?.firstName, Validators.required],
      lastName: [this.loggedInUserResume?.lastName || this.loggedInUser?.lastName, Validators.required],
      email: [this.loggedInUserResume?.email || this.loggedInUser?.username, [Validators.email, Validators.required]],
      phone: [this.loggedInUserResume?.phone || '' ? this.loggedInUserResume.phone : ''],
      experienceBlocks: this.formBuilder.array(this.buildExperienceBlock()),
      education: this.formBuilder.array(this.buildEducationForm()),
      id: this.loggedInUser.id,

    });

    this.resumeBuilderForm.disable();
  }

  buildExperienceBlock(): FormGroup[] {
    let expArr = this.loggedInUserResume?.experienceBlocks;
    if (this.loggedInUserResume) {
      expArr.forEach((exp: { title: any; company: any; location: any; startDate: any; endDate: any; description: any; }) => {
        this.expArrForm.push(this.formBuilder.group({
          title: [exp?.title, [Validators.required]],
          company: [exp?.company, [Validators.required]],
          location: [exp?.location, [Validators.required]],
          startDate: [exp?.startDate, [Validators.required]],
          endDate: [exp?.endDate, [Validators.required]],
          description: [exp?.description, [Validators.required]]
        }))
      });
      return this.expArrForm;
    }
    else {
      return [this.addExperienceBlock()];
    }

  }
  addExperienceBlock(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }
  buildEducationForm(): FormGroup[] {

    let eduArr = this.loggedInUserResume?.education;
    if (this.loggedInUserResume) {
      eduArr.forEach((edu: { level_of_education: any; school_name: any; field: any; startDate: any; endDate: any; }) => {
        this.eduArrForm.push(this.formBuilder.group({
          level_of_education: [edu.level_of_education, [Validators.required]],
          school_name: [edu.school_name, [Validators.required]],
          field: [edu.field, [Validators.required]],
          startDate: [edu.startDate, [Validators.required]],
          endDate: [edu.endDate, [Validators.required]],
        }))
      });
      return this.eduArrForm;
    }
    else {
      return [this.educations()];
    }
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
  get experienceBlocks(): FormArray {
    return this.resumeBuilderForm.get('experienceBlocks') as FormArray;
  }

  get education(): FormArray {
    return this.resumeBuilderForm.get('education') as FormArray;
  }

  goBack()
  {
    this.location.back();
  }
}
