import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { Chat, Usuario } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  usuario: Usuario = {};

  chatId: string = '';
  chat: Chat = {};
  mensajes: any[] = []; // Ajusta el tipo de datos según tu modelo de mensajes
  nuevoMensaje: string = '';

  constructor(private route: ActivatedRoute,
      private chatService: ChatService,
      private location: Location,
      private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();

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

      this.chatService.unirseAlChat(chatId);
      this.chatService.recibirMensaje().subscribe(async mensaje => {
        this.mensajes.push(mensaje);
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

  // enviarMensaje() {
  //   if (this.nuevoMensaje) {
  //     this.chatService.enviarMensaje(this.chatId, this.nuevoMensaje).subscribe(
  //       (response: any) => {
  //         this.nuevoMensaje = '';
  //         this.getMensajes();
  //       },
  //       (error) => {
  //         console.error('Error al enviar el mensaje', error);
  //       }
  //     );
  //   }
  // }

  enviarMensaje() {
    this.chatService.enviarMensaje(this.usuario._id!, this.nuevoMensaje, this.chatId);
    this.nuevoMensaje = '';
  }

  goBack() {
    this.location.back();
  }

}
