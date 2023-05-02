import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  articulos: Articulo[] = [];

  estadoInfiniteScroll = false;

  constructor(private articulosService: ArticulosService) { }
  
  ionViewDidEnter() {
    this.articulosService.getArticulos();
    console.log('ION VIEW');
  }

  ngOnInit() {
    this.scroll();

    this.articulosService.nuevoArticulo.subscribe(arti => {
      this.articulos.unshift(arti);
    });
    console.log('OnInit');
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.scroll(event, true);
    this.articulos = [];
    this.estadoInfiniteScroll = false;
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any, pull: boolean = false) {

    this.articulosService.getArticulos(pull)
      .subscribe(resp => {
      console.log(resp);
      this.articulos.push(...resp.articulos);
      
      if(event) {
        event.target.complete();
        if(resp.articulos.length === 0) {
          this.estadoInfiniteScroll = true;
          console.log('Todos los articulos se han cargado');
        }
      }
    })
    
  }

}
