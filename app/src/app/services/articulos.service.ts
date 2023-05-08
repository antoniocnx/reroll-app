import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Articulo, LocalFile, RespuestaArticulo, RespuestaCrearArticulo } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { firstValueFrom } from 'rxjs';
import { Photo } from '@capacitor/camera';
import { Directory, FileInfo } from '@capacitor/filesystem';

import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { LoadingController, Platform } from '@ionic/angular';
import { error } from 'console';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  //////////////////

  galeria: LocalFile[] = [];

  //////////////////

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

  crearArticulo(formData: FormData) {
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
  
  

  // async subirImagen(photo: Photo) {
  //   const base64Data = await this.readAsBase64(photo);
  //   console.log('Base64Data: ', base64Data);
  
  //   const fileName = new Date().getTime() + '.jpeg';
  //   const savedFile = await Filesystem.writeFile({
  //     path: fileName,
  //     data: base64Data,
  //     directory: Directory.Data
  //   });

  //   console.log('Archivo guardado: ', savedFile);

  //   this.loadFiles();
  //   // return {
  //   //   filepath: fileName,
  //   //   webviewPath: photo.webPath
  //   // };
  // }

  // async readAsBase64(photo: Photo) {
  //   if (this.platform.is('hybrid')) {
  //     const file = await Filesystem.readFile({
  //       path: photo.path
  //     });
  
  //     return file.data;
  //   }
  //   else {
  //     const response = await fetch(photo.webPath!);
  //     const blob = await response.blob();
  
  //     return await this.convertBlobToBase64(blob) as string;
  //   }
  // }
  
  // private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onerror = reject;
  //   reader.onload = () => {
  //       resolve(reader.result);
  //   };
  //   reader.readAsDataURL(blob);
  // });

  // // TENGO QUE SABER CÓMO CREAR LA CARPETA DONDE VA EL PSTH Y SE ALMACENAN LAS IMÁGENES

  // async loadFiles() {
  //   this.galeria = [];

  //   const loading = await this.loadingCtrl.create({
  //     message: 'Cargando datos...'
  //   });

  //   await loading.present();

  //   Filesystem.readdir({
  //     directory: Directory.Data,
  //     path: 'galeria'
  //   }).then(res => {
  //     console.log('No sé lo que estoy haciendo: ', res);
  //     this.loadFileData(res.files);
  //   }, async (error: any) => {
  //     console.log('Error: ', error);
  //     await Filesystem.mkdir({
  //       directory: Directory.Data,
  //       path: 'galeria'
  //     });
  //   }).then(_ => {
  //     loading.dismiss();
  //   })
  // }

  // async loadFileData(files: FileInfo[]) {
  //   for(let f of files) {
  //     const filePath = `galeria/${ f }`;

  //     const readFile = await Filesystem.readFile({
  //       directory: Directory.Data,
  //       path: filePath
  //     });

  //     console.log('READFILE: ', readFile);
  //       this.galeria.push({
  //         name: f.name,
  //         path: filePath,
  //         data: `data:image/jpeg;base, ${ readFile.data }`
  //       })
  //   }
  // }

}
