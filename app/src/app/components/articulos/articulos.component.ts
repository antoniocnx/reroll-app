import { Component, Input, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
})
export class ArticulosComponent implements OnInit {

  @Input() articulos: Articulo[] = [];

  esFavorito: boolean = false;

  constructor(private storage: StorageService,
              private articulosStorage: ArticulosService) { }

  ngOnInit() { this.esFavorito = this.storage.getFavorito(); }

  favorito() {
    this.storage.cambiaFavorito();
    
    this.esFavorito = this.storage.getFavorito();
    // this.esFavorito = this.storage.almacenaFavorito(this.esFavorito);
    
    console.log('FAVORITO EN ARTICULO.TS', this.esFavorito);
    // this.esFavorito = this.storage.getFavorito();
    // this.storage.guardarPostFavorito(this.articulo);
  }

}
