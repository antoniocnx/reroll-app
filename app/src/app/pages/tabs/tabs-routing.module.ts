import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'favoritos',
        loadChildren: () => import('../favoritos/favoritos.module').then(m => m.FavoritosPageModule)
      },
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'item/:id',
        loadChildren: () => import('../item/item.module').then(m => m.ItemPageModule)
      },
      {
        path: 'postear',
        loadChildren: () => import('../postear/postear.module').then(m => m.PostearPageModule)
      },
      {
        path: 'chats',
        loadChildren: () => import('../chats/chats.module').then(m => m.ChatPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'perfil/actualiza-perfil',
        loadChildren: () => import('../actualiza-perfil/actualiza-perfil.module').then(m => m.ActualizaPerfilPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('../usuario/usuario.module').then(m => m.UsuarioPageModule)
      },

      {
        path: 'perfil/mis-articulos',
        loadChildren: () => import('../mis-articulos/mis-articulos.module').then(m => m.MisArticulosPageModule)
      },
      {
        path: '',
        redirectTo: '/inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
