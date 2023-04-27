import { Component, Input, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
})
export class ArticuloComponent implements OnInit {

  esFavorito: boolean = false; //false;

  @Input() articulo: Articulo = {};

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

  constructor(private storage: StorageService) { }

  ngOnInit() {
    this.esFavorito = this.storage.getFavorito();
    console.log('FAVORITO OnInit EN ARTICULO.TS', this.esFavorito);
  }

  favorito() {
    this.storage.cambiaFavorito();
    
    this.esFavorito = this.storage.getFavorito();
    // this.esFavorito = this.storage.almacenaFavorito(this.esFavorito);
    
    console.log('FAVORITO EN ARTICULO.TS', this.esFavorito);
    // this.esFavorito = this.storage.getFavorito();
    // this.storage.guardarPostFavorito(this.articulo);
  }

}
