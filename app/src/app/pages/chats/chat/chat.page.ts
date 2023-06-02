import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Location, formatDate } from '@angular/common';
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
  yoUsuario: Usuario | undefined = {};
  otroUsuario: Usuario | undefined = {};

  articulo: Articulo = {};

  chatId: string = '';
  chat: Chat = {};
  mensajes: any[] = [];
  nuevoMensaje: string = '';

  constructor(private route: ActivatedRoute,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private ruta: Router) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();

    const chatId = this.route.snapshot.paramMap.get('id');

    if (chatId !== null) {
      this.chatId = chatId;

      this.getMensajes();
      this.chatService.getChatInfo(chatId).then(res => {
        this.chat = res;
        this.articulo = res.articulo;

        if (this.chat.usuario1?._id === this.usuario._id) {
          this.yoUsuario = this.chat.usuario1;
          this.otroUsuario = this.chat.usuario2;
        } else if (this.chat.usuario2?._id === this.usuario._id) {
          this.yoUsuario = this.chat.usuario2;
          this.otroUsuario = this.chat.usuario1;
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

  obtenerHora(fecha: string): string {
    const date = new Date(fecha);
    const hora = date.getHours();
    const minutos = date.getMinutes();
    return `${hora}:${minutos}`;
  }

  // Método para determinar si se debe mostrar la fecha
  mostrarFecha(index: number): boolean {
    if (index === 0) {
      // Mostrar la fecha en el primer mensaje
      return true;
    }

    const fechaActual = new Date(this.mensajes[index].fechaMsg);
    const fechaAnterior = new Date(this.mensajes[index - 1].fechaMsg);

    // Comparar las fechas para determinar si hay un cambio de día
    return (
      fechaActual.getDate() !== fechaAnterior.getDate() ||
      fechaActual.getMonth() !== fechaAnterior.getMonth() ||
      fechaActual.getFullYear() !== fechaAnterior.getFullYear()
    );
  }

  obtenerFecha(fecha: string): string {
    const fechaMsg = new Date(fecha);
    return formatDate(fechaMsg, 'dd/MM/yyyy', 'en-US');
  }

  goBack() {
    this.ruta.navigate(['/', 'user', 'chats']);
  }

  irAlArticulo(id?: string) {
    this.ruta.navigate(['/user/item/' + id]);
  }

}
