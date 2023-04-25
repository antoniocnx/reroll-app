import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActualizaPerfilPage } from '../actualiza-perfil/actualiza-perfil.page';

import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage,
    // children: [
    //   {
    //     path: 'actualiza-perfil',
    //     loadChildren: () => import('../actualiza-perfil/actualiza-perfil.module').then(m => m.ActualizaPerfilPageModule)
    //   } 
    // ]
  },
  {
    path: 'actualiza-perfil',
    component: ActualizaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
