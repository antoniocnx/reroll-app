import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  textoBusqueda: string = '';

  categoriaBusqueda: string = 'nombre';

  articulos: Articulo[] = [];

  estadoInfiniteScroll = false;

  constructor(private articulosService: ArticulosService) { }
  
  ionViewDidEnter() {
    this.articulosService.getArticulos();
  }

  ngOnInit() {
    this.scroll();

    this.articulosService.nuevoArticulo.subscribe(arti => {
      this.articulos.unshift(arti);
    });
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.scroll(event, true);
    this.articulos = [];
    this.estadoInfiniteScroll = false;
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any, pull: boolean = false) {
    this.articulosService.getArticulos(pull).subscribe(resp => {
      const nuevosArticulos = resp.articulos.filter(articulo => articulo.estado !== 'Vendido');
      this.articulos.push(...nuevosArticulos);
  
      if (event) {
        event.target.complete();
        if (nuevosArticulos.length === 0) {
          this.estadoInfiniteScroll = true;
        }
      }
    });
  }
  

  onCategoriaChange(event: any) {
    this.categoriaBusqueda = event.target.value;
  }

}
