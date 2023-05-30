import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';

const url = environment.heroku_url;
// const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: Socket;

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { 
    this.socket = io(url);
  }

  getChats(userId: string) {
    return this.http.get(`${ url }/chat/${userId}`);
  }

  createChat(userId: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    const options = { headers: headers };

    return this.http.post(`${url}/chat/${userId}`, {}, options);
    //return this.http.post(`${ url }/chat/${userId}`, { headers });
  }

  // enviarMensaje(chatId: string, texto: string) {
  //   const headers = new HttpHeaders({
  //     'x-token': this.usuarioService.token
  //   });

  //   const body = { texto };
  //   return this.http.post(`${ url }/chat/${chatId}/msg`, body, { headers });
  // }

  getMensajes(chatId: string) {
    return this.http.get(`${ url }/chat/${chatId}/mensajes`);
  }

  getChatInfo(chatId: string) {
    return this.http.get(`${ url }/chat/${chatId}/info`);
  }

  unirseAlChat(chatId: string) {
    this.socket.emit('joinChat', chatId);
  }

  enviarMensaje(usuario: string, texto: string, chatId: string) {
    this.socket.emit('mensaje', usuario, texto, chatId);
  }

  recibirMensaje(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('mensaje', (mensaje: any) => {
        observer.next(mensaje);
      })
    })
  }

}
