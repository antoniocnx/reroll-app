import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { }

  getChats(userId: string) {
    return this.http.get(`${ url }/chat/${userId}`);
  }

  createChat(userId: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    return this.http.post(`${ url }/chat/${userId}`, { headers });
  }

  enviarMensaje(chatId: string, texto: string) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    const body = { texto };
    return this.http.post(`${ url }/chat/${chatId}/msg`, body, { headers });
  }

  getMensajes(chatId: string) {
    return this.http.get(`${ url }/chat/${chatId}/mensajes`);
  }

  getChatInfo(chatId: string) {
    return this.http.get(`${ url }/chat/${chatId}/info`);
  }
}
