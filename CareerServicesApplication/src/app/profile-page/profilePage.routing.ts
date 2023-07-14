/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from '../profilePage/user-profile/user-profile.component';



export const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    children: []
  },


];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class ProfilePageRoutingModule {}
