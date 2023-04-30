import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
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

  esFavorito: boolean = false;

  blockSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  }
  
  constructor(private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private articulosService: ArticulosService, 
              private storage: StorageService,
              private http: HttpClient) { }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
      this.articulosService.getArticuloById(id).then(async res => {
        this.articulo = res;
      })
    });
  }

  favorito() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    const articuloId = this.articulo._id;
  
    console.log('TOKEN:', this.usuarioService.token); // Verificar el valor del token
    
    this.http.post(`${ url_local }/usuario/favoritos/${ articuloId }`, {}, { headers }).subscribe(
      (res: any) => {
        console.log('Petición al servidor de favoritos:', res); // Verificar la respuesta del servidor
        this.esFavorito = true;
        this.storage.cambiaFavorito();
        this.esFavorito = this.storage.getFavorito();
        console.log('FAVORITO EN ARTICULO.TS', this.esFavorito);
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

}
