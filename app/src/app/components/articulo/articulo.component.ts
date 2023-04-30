import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
})
export class ArticuloComponent implements OnInit {

  esFavorito: boolean = false;

  mostrarDetalle: boolean = false;

  @Input() articulo: Articulo = {};

  constructor(private storage: StorageService, private router: Router, private articulosService: ArticulosService) { }
  
  ngOnInit() {
    this.esFavorito = this.storage.getFavorito();
  }
  
  favorito() {
    this.storage.cambiaFavorito();
    
    this.esFavorito = this.storage.getFavorito();
    // this.esFavorito = this.storage.almacenaFavorito(this.esFavorito);
    
    console.log('FAVORITO EN ARTICULO.TS', this.esFavorito);
    // this.esFavorito = this.storage.getFavorito();
    // this.storage.guardarPostFavorito(this.articulo);
  }
  
  irAlArticulo(id: string) {
    this.router.navigate(['/user/item/' + id]);
  }

}
