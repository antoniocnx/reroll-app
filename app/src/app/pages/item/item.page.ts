import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  articulo: Articulo = {};

  esFavorito: boolean = false;

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }
  
  constructor(private route: ActivatedRoute, private articulosService: ArticulosService, private storage: StorageService) { }
  
  ngOnInit() {
    console.log('ARTICULO BASE: ' + this.articulo);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
      this.articulosService.getArticuloById(id).then(async res => {
        this.articulo = res;
        console.log('RES', res);
      })
    });
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
