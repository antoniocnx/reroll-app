import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Articulo, RespuestaFavoritos, RespuestaLogin, RespuestaSignUp, RespuestaUsuario, Usuario, Valoracion, ValoracionUsuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Observable, firstValueFrom, map } from 'rxjs';
import { resolve } from 'dns';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = '';

  private usuario: Usuario = {};

  constructor(private http: HttpClient,
    private storage: Storage,
    private navCrtl: NavController) {

    // Creamos la base de datos local antes de usar cualquier método que use Storage como guardarToken()
    this.storage.create();

    // Eliminar el token de la base de datos indexada de Google Chrome al cargar la aplicación
    window.addEventListener('load', () => {
      this.storage.remove('token');
    });

  }

  getUsuario() {
    if (!this.usuario._id) {
      this.validaToken();
    }
    return { ...this.usuario };
  }

  async getUsuarioById(id: string) {
    const res: any = await firstValueFrom(this.http.get(`${url}/usuario/${id}`));
    return res.usuario;
  }

  login(email: string, password: string) {
    const data = { email, password };

    return new Promise(resolve => {

      this.http.post<RespuestaLogin>(`${url}/usuario/login`, data)
        .subscribe(async resp => {
          console.log(resp);

          if (resp['ok']) {
            await this.guardarToken(resp['token']);
            resolve(true);
          } else {
            this.token = '';
            this.storage.clear();
            resolve(false);
          }

        });

    });

  }

  logout() {
    this.token = '';
    this.usuario = {};
    this.storage.clear();
    this.navCrtl.navigateRoot('login', { animated: true });
  }

  registro(usuario: Usuario) {
    return new Promise(resolve => {
      this.http.post<RespuestaSignUp>(`${url}/usuario/create`, usuario)
        .subscribe(resp => {
          console.log(resp);

          if (resp.status == 'ok') {
            this.guardarToken(resp['token']);
            resolve(true);
          } else {
            this.token = '';
            this.storage.clear();
            resolve(false);
          }

        })
    });
  }

  actualizarUsuario(usuario: Usuario) {
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return new Promise(resolve => {
      this.http.post<RespuestaLogin>(`${url}/usuario/update`, usuario, { headers })
        .subscribe(resp => {
          if (resp['ok']) {
            this.guardarToken(resp['token']);
            resolve(true);
          } else {
            resolve(false);
          }
        })
    })

  }

  getFavoritos() {
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return this.http.get<RespuestaFavoritos>(`${url}/usuario/favoritos`, { headers });

  }

  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);

    // Esto es necesario porque si hago login y logout con el mismo user de seguido la app se raya
    await this.validaToken();
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || '';
  }

  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if (this.token === '') {
      this.navCrtl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      });
      this.http.get<RespuestaUsuario>(`${url}/usuario/get`, { headers })
        .subscribe(resp => {
          if (resp['ok']) {
            this.usuario = resp['usuario'];
            resolve(true);
          } else {
            this.navCrtl.navigateRoot('/login');
            resolve(false);
          }
        })
    });
  }

  // getValoraciones(id: string) {
  //   const res: any = this.http.get<ValoracionUsuario>(`${ url }/usuario/valoraciones/${ id }`);
  //   return res.valoraciones;
  // }

  getValoraciones(id: string): Observable<Valoracion[]> {
    return this.http.get<{ ok: boolean, valoraciones: Valoracion[] }>(`${ url }/usuario/valoraciones/${ id }`).pipe(
      map(resp => resp.valoraciones)
    );
  }  

  valorar(idUsuario: string, puntuacion: number, comentario: string) {
    const headers = new HttpHeaders({
      'x-token': this.token
    });

    const valoracion = { puntuacion, comentario };

    return this.http.post(`${url}/usuario/${idUsuario}/valoraciones`, valoracion, { headers }).subscribe(
      (response) => {
        console.log('Valoración añadida correctamente');
      },
      (error) => {
        console.error('Error al añadir valoración', error);
      }
  )};

}
