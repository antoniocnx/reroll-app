import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, Platform } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { Articulo, LocalFile, RespuestaArticulo, RespuestaCrearArticulo } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { firstValueFrom } from 'rxjs';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  paginaArticulos = 0;

  nuevoArticulo = new EventEmitter<Articulo>();

  articuloSeleccionado: Articulo = {};

  constructor(private http: HttpClient,
    private usuarioService: UsuarioService,
    private platform: Platform,
    private loadingCtrl: LoadingController) { }

  seleccionarArticulo(articulo: Articulo) {
    this.articuloSeleccionado = articulo;
  }

  getArticulo() {
    return {...this.articuloSeleccionado};
  }

  getArticulos(pull: boolean = false) {
    if (pull) {
      this.paginaArticulos = 0;
    }

    this.paginaArticulos++;

    return this.http.get<RespuestaArticulo>(`${url}/articulo/get?pagina=${this.paginaArticulos}`);
  }

  getNumArticulos() {
    return this.http.get<RespuestaArticulo>(`${url}/articulo/get`);
  }

  async getArticuloById(id: string) {
    const res: any = await firstValueFrom(this.http.get(`${url}/articulo/${id} `));
    return res.articulo;
  }
  
  // FUNCIONA PERO SIN IMÁGENES
  // crearArticulo(articulo: any) {
  //   const headers = new HttpHeaders({
  //     'x-token': this.usuarioService.token
  //   })

  //   return new Promise(resolve => {
  //     this.http.post<RespuestaCrearArticulo>(`${url}/articulo/post`, articulo, { headers })
  //       .subscribe(resp => {
  //         this.nuevoArticulo.emit(resp['articulo']);
  //         resolve(true);
  //       });
  //   });

  // }

  // Crea artículos con imágenes
  crearArticulo(formData:FormData) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise(resolve => {
      this.http.post<RespuestaCrearArticulo>(`${url}/articulo/post`, formData, { headers })
        .subscribe(resp => {
          this.nuevoArticulo.emit(resp['articulo']);
          resolve(true);
        });
    });
  }

  // eliminarArticulo(articuloId: string) {

  //   const headers = new HttpHeaders({
  //     'x-token': this.usuarioService.token
  //   });

  //   return this.http.delete<{ success: boolean, message: string }>(`${url}/articulo/delete/${articuloId}`, { headers });
  // }

  eliminarArticulo(articuloId: string) {
    return this.http.delete<{ success: boolean, message: string }>(`${url}/articulo/delete/${articuloId}`);
  }

}
