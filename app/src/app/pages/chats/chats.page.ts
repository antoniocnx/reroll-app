import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chat, Usuario } from 'src/app/interfaces/interfaces';
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

  constructor(private chatService: ChatService,
              private usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit() {
    this.getChats();

    // this.obtenerChatInfo();
  }

  getChats() {
    this.usuario = this.usuarioService.getUsuario();
    const userId = this.usuario._id;
    if(userId) {
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

  obtenerChatInfo(chatId: string) {
    this.chatService.getChatInfo(chatId).subscribe(
      (res: any) => {
        // Manejar la respuesta del chat
        this.chat = res.chat;
        // ...
      },
      (error: any) => {
        console.error(error);
        // Manejar el error al obtener la información del chat
      }
    );
  }

  irAChat(chatId?: string) {
    this.router.navigate(['/', 'user','chats', 'chat', chatId]);
  }

}
