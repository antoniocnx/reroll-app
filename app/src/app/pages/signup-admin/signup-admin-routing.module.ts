import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupAdminPage } from './signup-admin.page';

const routes: Routes = [
  {
    path: '',
    component: SignupAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupAdminPageRoutingModule {}
