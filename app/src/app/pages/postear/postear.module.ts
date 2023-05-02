import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostearPageRoutingModule } from './postear-routing.module';

import { PostearPage } from './postear.page';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    PostearPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PostearPage]
})
export class PostearPageModule {}
