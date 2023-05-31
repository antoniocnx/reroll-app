import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, AfterViewChecked } from '@angular/core';
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
import { AlertController, ModalController } from '@ionic/angular';
import { ReporteComponent } from 'src/app/components/reporte/reporte.component';
import { EditarArticuloComponent } from 'src/app/components/editar-articulo/editar-articulo.component';
import { ChatService } from 'src/app/services/chat.service';

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

  // Google Maps

  lat: Number = 0;
  lng: Number = 0;

  //

  constructor(private route: ActivatedRoute,
    private ruta: Router,
    private usuarioService: UsuarioService,
    private articulosService: ArticulosService,
    private alertController: AlertController,
    private http: HttpClient,
    private location: Location,
    private modalController: ModalController,
    private chatService: ChatService) { }

  ngOnInit() {
    this.usuarioActual = this.usuarioService.getUsuario();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
      this.articulosService.getArticuloById(id).then(async res => {
        this.articulo = res;


        const geocoder = new google.maps.Geocoder();
        const address = ` ${this.articulo.usuario?.direccion}, 
                      ${this.articulo.usuario?.ciudad}, 
                      ${this.articulo.usuario?.localidad}, 
                      ${this.articulo.usuario?.pais}, 
                      ${this.articulo.usuario?.cp}`;

        geocoder.geocode({ address: address }, (results: any, status: any) => {
          if (status === 'OK') {
            this.lat = results[0].geometry.location.lat();
            this.lng = results[0].geometry.location.lng();
            // Inicializar el mapa de Google Maps
            this.initMap();
          }
        });
      })
    });

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulosFavoritos = res.favoritos;

      this.esFavorito = this.articulosFavoritos.some(articuloFavorito => articuloFavorito._id === this.articulo._id);

    });

  }

  // ngAfterViewChecked() {
  //   this.route.paramMap.subscribe(params => {
  //     const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
  //     this.articulosService.getArticuloById(id).then(async res => {
  //       this.articulo = res;
  //     })
  //   });

  //   this.usuarioService.getFavoritos().subscribe(res => {
  //     this.articulosFavoritos = res.favoritos;

  //     this.esFavorito = this.articulosFavoritos.some(articuloFavorito => articuloFavorito._id === this.articulo._id);

  //   });
  // }

  favorito() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    const articuloId = this.articulo._id;

    this.http.post(`${url}/usuario/favoritos/${articuloId}`, {}, { headers }).subscribe(
      (res: any) => {
        this.esFavorito = !this.esFavorito;
      },
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
            if (this.articulo._id) {
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
      center: { lat: this.lat, lng: this.lng },
      zoom: 12
    });

    // Marcador de la ubicación
    // const marker = new google.maps.Marker({
    //   position: {lat: this.lat, lng: this.lng},
    //   map: map,
    //   title: 'Ubicación del usuario'
    // });

    // Radio de la ubicación
    const circle = new google.maps.Circle({
      strokeColor: '#00FFD2',
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: '#00FFD2',
      fillOpacity: 0.35,
      map: map,
      center: { lat: this.lat, lng: this.lng },
      radius: 3000
    });
  }

  async editarArticulo() {
    const modal = await this.modalController.create({
      component: EditarArticuloComponent,
      componentProps: {
        articuloId: this.articulo._id
      }
    });

    await modal.present();
  }

  async hacerReporte() {
    const modal = await this.modalController.create({
      component: ReporteComponent,
      componentProps: {
        articuloId: this.articulo._id
      }
    });

    await modal.present();
  }

  // crearChat(articuloId?: string, usuarioId?: string) {
  //   if (articuloId && usuarioId) {
  //     this.chatService.createChat(articuloId, usuarioId).subscribe(
  //       (response: any) => {
  //         const chatId = response.chat._id;
  //         console.log('Chat creado:', response);
  //         console.log('Chat ID:', chatId);
  //         this.ruta.navigate(['/', 'user','chats', 'chat', chatId]);
  //       },
  //       (error) => {
  //         console.error('Error al crear el chat:', error);
  //       }
  //     );
  //   }
  // }

  crearChat(articuloId?: string, usuarioId?: string) {
    if (articuloId && usuarioId) {
      // Comprobar si existe un chat entre los usuarios y el artículo
      this.chatService.existeChat(articuloId, this.usuarioActual._id!, usuarioId).subscribe(
        (response: any) => {
          const existeChat = response.existeChat;
  
          if (existeChat) {
            // Si existe el chat, abrir la sala de chat existente
            this.ruta.navigate(['/', 'user', 'chats', 'chat', existeChat._id]);
          } else {
            // Si no existe el chat, crear uno nuevo
            this.chatService.createChat(articuloId, usuarioId).subscribe(
              (response: any) => {
                const chatId = response.chat._id;
                console.log('Chat creado:', response);
                console.log('Chat ID:', chatId);
                this.ruta.navigate(['/', 'user', 'chats', 'chat', chatId]);
              },
              (error) => {
                console.error('Error al crear el chat:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error al comprobar la existencia del chat:', error);
        }
      );
    }
  }
  
  

}
