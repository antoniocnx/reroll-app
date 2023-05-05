import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';

SwiperCore.use([Navigation, Pagination, Autoplay]);

import { Articulo, ArticuloFavorito } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;
const url_local = environment.url;

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  token: string = '';

  articulo: Articulo = {};

  articulosFavoritos: Articulo[] = [];

  esFavorito: boolean = false;

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }
  
  constructor(private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private articulosService: ArticulosService, 
              private storage: StorageService,
              private http: HttpClient,
              private location: Location) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
      this.articulosService.getArticuloById(id).then(async res => {
        this.articulo = res;
        console.log('ARTÍCULO: ', res);
      })
    });

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulosFavoritos = res.favoritos;

      this.esFavorito = this.articulosFavoritos.some(articuloFavorito => articuloFavorito._id === this.articulo._id);

    });

  }

  favorito() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    const articuloId = this.articulo._id;
  
    console.log('TOKEN:', this.usuarioService.token); // Verificar el valor del token
    
    this.http.post(`${ url }/usuario/favoritos/${ articuloId }`, {}, { headers }).subscribe(
      (err: any) => {
        console.error(err);
      }
    );
  }

  goBack() {
    this.location.back();
  }
  

}
