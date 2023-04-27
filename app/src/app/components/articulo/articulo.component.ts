import { Component, Input, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
})
export class ArticuloComponent implements OnInit {

  esFavorito: boolean = false;

  @Input() articulo: Articulo = {};

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

  constructor(private storage: StorageService) { }

  ngOnInit() {
    this.esFavorito = this.storage.getFavorito();
  }

  favorito() {
    // this.storage.cambiaFavorito();
    this.esFavorito = !this.esFavorito;
    this.esFavorito = this.storage.getFavorito();
    // this.storage.guardarPostFavorito(this.articulo);
  }

}
