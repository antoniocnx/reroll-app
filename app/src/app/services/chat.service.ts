import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';
import { Socket, io } from 'socket.io-client';
import { Observable, firstValueFrom } from 'rxjs';

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

  createChat(articuloId: string, userId: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    const options = { headers: headers };

    return this.http.post(`${url}/chat/${articuloId}/${userId}`, {}, options);

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

  async getChatInfo(chatId: string) {
    const res: any = await firstValueFrom(this.http.get(`${ url }/chat/${chatId}/info`));
    return res.chat;
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

  existeChat(articuloId: string, usuario1Id: string, usuario2Id: string) {
    return this.http.get(`${url}/chat/check/${articuloId}/${usuario1Id}/${usuario2Id}`);
  }

}
