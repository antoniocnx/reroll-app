import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';

import { InicioPage } from './inicio.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
    declarations: [InicioPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExploreContainerComponentModule,
        InicioPageRoutingModule,
        RouterModule,
        ComponentsModule,
        PipesModule
    ]
})
export class InicioPageModule {}
