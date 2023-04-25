import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Administrador, RespuestaAdmin, RespuestaLogin, RespuestaSignUp, RespuestaUsuario, Usuario } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { NavController } from '@ionic/angular';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  token: string = '';
  private admin: Administrador = {};

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

  getAdmin() {
    if(!this.admin._id) {
      this.validaToken();
    }
    return {...this.admin};
  }

  login(email: string, password: string) {
    const data = { email, password };
    
    return new Promise(resolve => {

      this.http.post<RespuestaLogin>(`${url}/administrador/login`, data)
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
    this.admin = {};
    this.storage.clear();
    this.navCrtl.navigateRoot('login', {animated: true});
  }

  registro(admin: Administrador) {
    return new Promise( resolve => {
      this.http.post<RespuestaSignUp>(`${url}/administrador/create`, admin)
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
      this.navCrtl.navigateRoot('/login-admin');
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      const headers = new HttpHeaders({
        'y-token': this.token
      });
      this.http.get<RespuestaAdmin>(`${url}/administrador/get`, { headers })
              .subscribe(resp => {
                if(resp['ok']) {
                  this.admin = resp['admin'];
                  resolve(true);
                } else {
                  this.navCrtl.navigateRoot('/login-admin');
                  resolve(false);
                }
              })
    });
  }

  actualizarAdmin(admin: Administrador) {
    const headers = new HttpHeaders({
      'y-token': this.token
    });

    return new Promise(resolve => {
      this.http.post<RespuestaLogin>(`${url}/administrador/update`, admin, { headers })
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
}
