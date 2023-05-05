import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemPageRoutingModule } from './item-routing.module';

import { ItemPage } from './item.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from "../../pipes/pipes.module";
import { SwiperModule } from 'swiper/angular';

@NgModule({
    declarations: [ItemPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ItemPageRoutingModule,
        ComponentsModule,
        SwiperModule,
        PipesModule
    ]
})
export class ItemPageModule {}
