import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resume-page',
  templateUrl: './resume-page.component.html',
  styleUrls: ['./resume-page.component.scss']
})
export class ResumePageComponent {

  resumeBuilderForm: FormGroup;
  constructor(public formBuilder: FormBuilder) {




    this.resumeBuilderForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      experienceBlocks: this.formBuilder.array(
        [this.buildExperienceBlock()])
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

  addExperience() {
   // this.experienceBlocks.insert(0, this.buildExperienceBlock());
   }
}
