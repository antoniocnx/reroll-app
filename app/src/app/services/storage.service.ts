import { Injectable } from '@angular/core';

import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
//import { Juego } from '../interfaces/interfaces';

import { ToastController } from '@ionic/angular';
import { RespuestaFavoritos } from '../interfaces/interfaces';
// import { url } from 'inspector';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  esFavorito: boolean = false;

  constructor(private http: HttpClient, private storage: Storage, private toastCtrl: ToastController) {
    // this.cargarFavoritos();
   }

  getFavorito() {
    return this.esFavorito;
  }

  cambiaFavorito() {
    this.esFavorito = !this.esFavorito;
  }


  // Esto sirve para mandarle mensajes a los usuarios
  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 1500,
      position: 'middle' // También puede ser top o bottom
    });

    await toast.present();
  }

  

}
