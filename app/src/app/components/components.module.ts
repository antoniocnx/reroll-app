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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteComponent } from './reporte/reporte.component';
import { EditarArticuloComponent } from './editar-articulo/editar-articulo.component';


@NgModule({
  declarations: [
    ArticuloComponent, 
    ArticulosComponent,
    AvatarSelectorComponent,
    MapaComponent,
    ChatBoxComponent,
    ValoracionComponent,
    ReporteComponent,
    EditarArticuloComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ArticuloComponent,
    ArticulosComponent,
    AvatarSelectorComponent,
    MapaComponent,
    ChatBoxComponent,
    ValoracionComponent,
    ReporteComponent,
    EditarArticuloComponent
  ]
})
export class ComponentsModule { }
