import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Post, RespuestaCrearPost, RespuestaPost } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = 0;

  nuevoPost = new EventEmitter<Post>();

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { }
  
  getPosts(pull: boolean = false) {
    if(pull) {
      this.paginaPosts = 0;
    }

    this.paginaPosts++;

    return this.http.get<RespuestaPost>(`${url}/posts/get?pagina=${this.paginaPosts}`);
  }

  crearPost(post: any) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    })

    return new Promise(resolve => {
      this.http.post<RespuestaCrearPost>(`${url}/posts/post`, post, {headers})
                .subscribe(resp => {
                  this.nuevoPost.emit(resp['post']);
                  resolve(true);
                });
    });

  }

  // Alternativa
  async subirImagen( img: string ) {
    
    const respuesta = await fetch(img);
    const blob = await respuesta.blob();
    const formData = new FormData();
    formData.append('image', blob, img);
      
    let post = {imagen:img};
    const headers = {
      'x-token': this.usuarioService.token
    }

    this.http.post(`${url}/posts/upload`, post, {headers})
      .subscribe(resp => {
        console.log(resp);
      });
   };
  

  // Original

  // subirImagen( img: string ) {

  //   const options: FileUploadOptions = {
  //     fileKey: 'image',
  //     headers: {
  //       'x-token': this.usuarioService.token
  //     }
  //   };

  //   const fileTransfer: FileTransferObject = FileTransfer.create();

  //   fileTransfer.upload( img, `${url}/posts/upload`, options )
  //     .then( data => {
  //       console.log(data);
  //     }).catch( err => {
  //       console.log('Error al subir la imagen', err);
  //     });

  // };

  // Alternativa David

  // subirImagen(img: string) {
    
  //   let post = {imagen:img};
  //   const headers = {
  //     'x-token': this.usuarioService.token
  //   }

  //   this.http.post(`${url}/posts/upload`, post, {headers})
  //     .subscribe(resp => {
  //       console.log(resp);
  //     });
  //  };

}
