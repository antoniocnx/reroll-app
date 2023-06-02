import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
})
export class ArticulosComponent implements OnInit {
  
  @Input() textoBusqueda: string = '';
  
  @Input() categoriaBusqueda: string = '';

  @Input() articulos: Articulo[] = [];

  constructor() { }

  ngOnInit() { 

  }

}
