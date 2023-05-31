import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { Articulo, Chat, Usuario } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  usuario: Usuario = {};
  articulo: Articulo = {};

  chatId: string = '';
  chat: Chat = {};
  mensajes: any[] = []; // Ajusta el tipo de datos según tu modelo de mensajes
  nuevoMensaje: string = '';

  mostrarTabs = false; // Variable para controlar la visibilidad de las tabs

  constructor(private route: ActivatedRoute,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private ruta: Router,
    private articulosService: ArticulosService) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();

    const chatId = this.route.snapshot.paramMap.get('id');
    console.log(chatId);
    if (chatId !== null) {
      this.chatId = chatId;
      console.log(chatId);
      this.getMensajes();
      this.chatService.getChatInfo(chatId).subscribe((res: Chat) => {
        this.chat = res;
        console.log('CHAT', res);
        if (res) {
          res.articulo = this.articulo;
          console.log('ARTICULO', res.articulo)
        }
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

  enviarMensaje() {
    this.chatService.enviarMensaje(this.usuario._id!, this.nuevoMensaje, this.chatId);
    this.nuevoMensaje = '';
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

  goBack() {
    this.ruta.navigate(['/', 'user', 'chats']);
  }

}
