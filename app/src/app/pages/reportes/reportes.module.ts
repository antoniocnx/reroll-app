import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { ReportesPageRoutingModule } from './reportes-routing.module';

import { ReportesPage } from './reportes.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesPageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [ReportesPage]
})
export class ReportesPageModule {}
