import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisArticulosPageRoutingModule } from './mis-articulos-routing.module';

import { MisArticulosPage } from './mis-articulos.page';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisArticulosPageRoutingModule,
    RouterModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [MisArticulosPage]
})
export class MisArticulosPageModule {}
