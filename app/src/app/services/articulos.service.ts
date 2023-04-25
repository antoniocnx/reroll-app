import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Articulo, RespuestaArticulo, RespuestaCrearArticulo } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  paginaArticulos = 0;

  nuevoArticulo = new EventEmitter<Articulo>();

  constructor(private http: HttpClient,
    private usuarioService: UsuarioService) { }

  getArticulos(pull: boolean = false) {
    if(pull) {
      this.paginaArticulos = 0;
    }
  
    this.paginaArticulos++;
  
    return this.http.get<RespuestaArticulo>(`${url}/articulo/get?pagina=${this.paginaArticulos}`);
  }

  crearArticulo(articulo: any) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })

    return new Promise(resolve => {
      this.http.post<RespuestaCrearArticulo>(`${url}/posts/post`, articulo, {headers})
                .subscribe(resp => {
                  this.nuevoArticulo.emit(resp['articulo']);
                  resolve(true);
                });
    });

  }

}
