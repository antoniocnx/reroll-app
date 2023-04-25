import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostearPage } from './postear.page';

const routes: Routes = [
  {
    path: '',
    component: PostearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostearPageRoutingModule {}
