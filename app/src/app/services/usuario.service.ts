import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Articulo, RespuestaFavoritos, RespuestaLogin, RespuestaSignUp, RespuestaUsuario, Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

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
    if(!this.usuario._id) {
      this.validaToken();
    }
    return {...this.usuario};
  }

  login(email: string, password: string) {
    const data = { email, password };
    
    return new Promise(resolve => {

      this.http.post<RespuestaLogin>(`${url}/usuario/login`, data)
                .subscribe(async resp => {
                  console.log(resp);
  
                  if( resp['ok'] ) {
                    await this.guardarToken( resp['token'] );
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
    this.navCrtl.navigateRoot('login', {animated: true});
  }

  registro(usuario: Usuario) {
    console.log(usuario);
    return new Promise( resolve => {
      this.http.post<RespuestaSignUp>(`${url}/usuario/create`, usuario)
                .subscribe( resp => {
                  console.log(resp);

                  if( resp.status == 'ok' ) {
                    this.guardarToken( resp['token'] );
                    resolve(true);
                  } else {
                    this.token = '';
                    this.storage.clear();
                    resolve(false);
                  }
                  
                })
    });
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

    if(this.token === '') {
      this.navCrtl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders({
        'x-token': this.token
      });
      this.http.get<RespuestaUsuario>(`${url}/usuario/get`, { headers })
              .subscribe(resp => {
                if(resp['ok']) {
                  this.usuario = resp['usuario'];
                  resolve(true);
                } else {
                  this.navCrtl.navigateRoot('/login');
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
                  if(resp['ok']) {
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

    return this.http.get<RespuestaFavoritos>(`${ url }/usuario/favoritos`, { headers });
    
  }


}
