import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisArticulosPage } from './mis-articulos.page';

const routes: Routes = [
  {
    path: '',
    component: MisArticulosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisArticulosPageRoutingModule {}
