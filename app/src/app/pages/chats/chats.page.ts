import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo, Chat, Usuario } from 'src/app/interfaces/interfaces';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})

export class ChatPage implements OnInit {

  chat: Chat = {};
  chats: Chat[] = [];
  usuario: Usuario = {};
  articulo: Articulo = {};

  constructor(
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private router: Router) {}

  ngOnInit() {
    this.getChats();
  }

  getChats() {
    this.usuario = this.usuarioService.getUsuario();
    const userId = this.usuario._id;
    if (userId) {
      this.chatService.getChats(userId).subscribe(
        (response: any) => {
          this.chats = response.chats;
        },
        (error) => {
          console.error('Error al obtener los chats', error);
        }
      );
    }
  }
  
  getOtroUsuario(chat: Chat): Usuario | undefined {
    if (chat.usuario1?._id === this.usuario._id) {
      return chat.usuario2;
    } else if (chat.usuario2?._id === this.usuario._id) {
      return chat.usuario1;
    }
    return undefined;
  }

  getUsuarioAvatar(chat: Chat): string {
    const otroUsuario = this.getOtroUsuario(chat);
    return otroUsuario?.avatar || '';
  }

  getUsuarioNombre(chat: Chat): string {
    const otroUsuario = this.getOtroUsuario(chat);
    return otroUsuario?.nombre || '';
  }

  getUsuarioApellidos(chat: Chat): string {
    const otroUsuario = this.getOtroUsuario(chat);
    return otroUsuario?.apellidos || '';
  }

  getArticuloChat(chat: Chat) {
    return chat.articulo?.nombre;
  }
  
  getHoraUltimoMensaje(chat: Chat) {
    if (chat.mensajes && chat.mensajes.length > 0) {
      const ultimoMensaje = chat.mensajes[chat.mensajes.length - 1].fechaMsg;
      const date = new Date(ultimoMensaje);
      const hora = String(date.getHours()).padStart(2, '0');
      const minutos = String(date.getMinutes()).padStart(2, '0');
      return `${hora}:${minutos}`;
    }
    return '';
  }

  getUltimoMensaje(chat: Chat) {
    if (chat.mensajes && chat.mensajes.length > 0) {
      const ultimoMensaje = chat.mensajes[chat.mensajes.length - 1].texto;
      return `${ultimoMensaje}`;
    }
    return '';
  }

  irAChat(chatId?: string) {
    this.router.navigate(['/', 'user', 'chats', 'chat', chatId]);
  }

}

