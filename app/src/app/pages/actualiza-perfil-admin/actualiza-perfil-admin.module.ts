import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizaPerfilAdminPageRoutingModule } from './actualiza-perfil-admin-routing.module';

import { ActualizaPerfilAdminPage } from './actualiza-perfil-admin.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualizaPerfilAdminPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [ActualizaPerfilAdminPage]
})
export class ActualizaPerfilAdminPageModule {}
