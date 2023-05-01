import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Articulo, RespuestaArticulo, RespuestaCrearArticulo } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private usuarioService: UsuarioService) { }

  seleccionarArticulo(articulo: Articulo) {
    this.articuloSeleccionado = articulo;
  }

  getArticulos(pull: boolean = false) {
    if (pull) {
      this.paginaArticulos = 0;
    }

    this.paginaArticulos++;

    return this.http.get<RespuestaArticulo>(`${url}/articulo/get?pagina=${this.paginaArticulos}`);
  }

  async getArticuloById(id: string) {
    const res: any = await firstValueFrom(this.http.get(`${url}/articulo/${id} `));
    return res.articulo;
  }

  crearArticulo(articulo: any) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })

    return new Promise(resolve => {
      this.http.post<RespuestaCrearArticulo>(`${url}/articulo/post`, articulo, { headers })
        .subscribe(resp => {
          this.nuevoArticulo.emit(resp['articulo']);
          resolve(true);
        });
    });

  }

  // subirImagen(img: string) {

  //   const options: FileUploadOptions = {
  //     fileKey: 'image',
  //     headers: {
  //       'x-token': this.usuarioService.token
  //     }
  //   };

  //   const fileTransfer: FileTransferObject = FileTransfer.create();

  //   fileTransfer.upload(img, `${url}/posts/upload`, options)
  //     .then(data => {
  //       console.log(data);
  //     }).catch(err => {
  //       console.log('Error al subir la imagen', err);
  //     });

  // };

}
