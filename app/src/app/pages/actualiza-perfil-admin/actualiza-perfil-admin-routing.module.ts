import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizaPerfilAdminPage } from './actualiza-perfil-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizaPerfilAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizaPerfilAdminPageRoutingModule {}
