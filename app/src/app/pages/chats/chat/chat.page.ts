import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { Chat } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chatId: string = '';
  chat: Chat = {};
  mensajes: any[] = []; // Ajusta el tipo de datos según tu modelo de mensajes
  nuevoMensaje: string = '';

  constructor(private route: ActivatedRoute,
      private chatService: ChatService,
      private location: Location) { }

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    console.log(chatId);
    if (chatId !== null) {
      this.chatId = chatId;
      console.log(chatId);
      this.getMensajes();
      this.chatService.getChatInfo(chatId).subscribe(res => {
        this.chat = res;
        console.log(res);
      });
    }
  }

  getMensajes() {
    this.chatService.getMensajes(this.chatId).subscribe(
      (response: any) => {
        this.mensajes = response.mensajes;
      },
      (error) => {
        console.error('Error al obtener los mensajes del chat', error);
      }
    );
  }

  enviarMensaje() {
    if (this.nuevoMensaje) {
      this.chatService.enviarMensaje(this.chatId, this.nuevoMensaje).subscribe(
        (response: any) => {
          this.nuevoMensaje = '';
          this.getMensajes();
        },
        (error) => {
          console.error('Error al enviar el mensaje', error);
        }
      );
    }
  }

  goBack() {
    this.location.back();
  }

  // name: string = 'Chat';
  // message: string = '';
  // isLoading = false;
  // currentUserId = 1;
  // chats = [
  //   {id: 1, sender: 1, message: 'Hola!'},
  //   {id: 2, sender: 2, message: 'Lo primero de todo, cómo están los máquinas?'},
  // ];

  // constructor() { }

  // ngOnInit() {
  // }

  // sendMessage() {}

}
