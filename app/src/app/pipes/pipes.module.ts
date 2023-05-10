import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { BusquedaPipe } from './busqueda.pipe';



@NgModule({
  declarations: [
    DomSanitizerPipe,
    ImagenPipe,
    ImageSanitizerPipe,
    BusquedaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DomSanitizerPipe,
    ImagenPipe,
    ImageSanitizerPipe,
    BusquedaPipe
  ]
})
export class PipesModule { }
