import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { MapaComponent } from './mapa/mapa.component';
import { SwiperModule } from 'swiper/angular';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ArticuloComponent } from './articulo/articulo.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { ValoracionComponent } from './valoracion/valoracion.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ArticuloComponent, 
    ArticulosComponent,
    AvatarSelectorComponent,
    MapaComponent,
    ChatBoxComponent,
    ValoracionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    SwiperModule,
    FormsModule
  ],
  exports: [
    ArticuloComponent,
    ArticulosComponent,
    AvatarSelectorComponent,
    MapaComponent,
    ChatBoxComponent,
    ValoracionComponent
  ]
})
export class ComponentsModule { }
