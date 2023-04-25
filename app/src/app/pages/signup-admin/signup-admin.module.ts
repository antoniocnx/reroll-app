import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupAdminPageRoutingModule } from './signup-admin-routing.module';

import { SignupAdminPage } from './signup-admin.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupAdminPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [SignupAdminPage]
})
export class SignupAdminPageModule {}
