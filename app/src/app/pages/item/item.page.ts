import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';

SwiperCore.use([Navigation, Pagination, Autoplay]);

import { Articulo, ArticuloFavorito, Usuario } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

declare const google: any;

const url = environment.heroku_url;
const url_local = environment.url;

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  token: string = '';

  usuarioActual: Usuario = {}

  articulo: Articulo = {};

  articulosFavoritos: Articulo[] = [];

  esFavorito: boolean = false;

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }

  lat: Number = 0;
  lng: Number = 0;
  
  constructor(private route: ActivatedRoute,
              private ruta: Router,
              private usuarioService: UsuarioService,
              private articulosService: ArticulosService, 
              private alertController: AlertController,
              private http: HttpClient,
              private location: Location) { }
  
  ngOnInit() {
    this.usuarioActual = this.usuarioService.getUsuario();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
      this.articulosService.getArticuloById(id).then(async res => {
        this.articulo = res;
      })
    });

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulosFavoritos = res.favoritos;

      this.esFavorito = this.articulosFavoritos.some(articuloFavorito => articuloFavorito._id === this.articulo._id);

    });

    const geocoder = new google.maps.Geocoder();
    const address = ` ${this.usuarioActual.direccion}, 
                      ${this.usuarioActual.ciudad}, 
                      ${this.usuarioActual.localidad}, 
                      ${this.usuarioActual.pais}, 
                      ${this.usuarioActual.cp}`;
                      
    geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === 'OK') {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        // Inicializar el mapa de Google Maps
        this.initMap();
      }
    });

  }

  favorito() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    const articuloId = this.articulo._id;
    
    this.http.post(`${ url }/usuario/favoritos/${ articuloId }`, {}, { headers }).subscribe(
      (err: any) => {
        console.error(err);
      }
    );
  }

  goBack() {
    this.location.back();
  }

  async eliminar() {
    const alert = await this.alertController.create({
      header: '¿Quieres eliminar este artículo?',
      message: 'Una vez eliminado el artículo no se podrá recuperar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, 
        {
          text: 'Eliminar',
          handler: () => {
            if(this.articulo._id) {
              this.articulosService.eliminarArticulo(this.articulo._id).subscribe(
                response => {
                  console.log(response.message);
                  this.ruta.navigateByUrl('/user/inicio');
                },
                error => console.log(error)
              );
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  irAUsuario(usuario: Usuario) {
    const navigationExtras = {
      state: {
        articulo: this.articulo
      }
    };
  
    this.ruta.navigate(['/user', usuario._id], navigationExtras);
  }
  
  // Google Maps

  initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: this.lat, lng: this.lng},
      zoom: 18
    });
    
    const marker = new google.maps.Marker({
      position: {lat: this.lat, lng: this.lng},
      map: map,
      title: 'Ubicación del usuario'
    });
  }

}
