import { Injectable } from '@angular/core';

import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
//import { Juego } from '../interfaces/interfaces';

import { ToastController } from '@ionic/angular';
import { Post } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  postsFavoritos: Post[] = [];

  esFavorito: boolean = false;

  getFavorito() {
    return this.esFavorito;
    // return this.almacenaFavorito(this.esFavorito);
  }

  cambiaFavorito() {
    this.esFavorito = !this.esFavorito;
    console.log('FAVORITO EN STORAGE', this.esFavorito);
    // this.almacenaFavorito(this.esFavorito);
  }

  // almacenaFavorito(fav: boolean) {
  //   return fav;
  // }

  constructor(private storage: Storage, private toastCtrl: ToastController) {
    // this.cargarFavoritos();
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

  guardarPostFavorito(post: Post) {
    let mensaje = '';

    const index = this.postsFavoritos.indexOf(post);
    if (index > -1) {
      this.postsFavoritos.splice(index, 1);
      mensaje = 'Post eliminado de Favoritos';
    } else {
      this.postsFavoritos.unshift(post);
      mensaje = 'Post agregado a Favoritos';
    }

    this.presentToast(mensaje);
  }

  // guardarPost(post: Post) {
  //   let existe = false;
  //   let mensaje = '';

  //   for(const post of this.posts) {
  //     if(post._id == post._id) {
  //       existe = true;
  //       break;
  //     }
  //   }

  //   if(existe) {
  //     this.posts = this.posts.filter(post => post._id !== post._id);
  //     mensaje = 'Post eliminado de Favoritos';
  //   } else {
  //     this.posts.push(post);
  //     mensaje = 'Post agregado a Favoritos';
  //   }
    
  //   this.presentToast(mensaje);

  //   this.storage.set('posts', this.posts);

  //   // Regreso el valor inverso porque si existe, borro el post del storage
  //   return !existe;

  // }

  // async cargarFavoritos() {
  //   const posts = await this.storage.get('posts');
  //   this.posts = posts || [];
  //   return this.posts;
  // }

  // async existePost(id: string) {
  //   await this.cargarFavoritos();
  //   const existe = this.posts.find(post => post._id === id);
  //   if(existe) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

}
