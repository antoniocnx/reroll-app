import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizaPerfilPage } from './actualiza-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizaPerfilPageRoutingModule {}
