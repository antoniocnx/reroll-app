import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

// import { AuthService } from 'src/app/services/auth.service';
// import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  articulos: Articulo[] = [];

  esFavorito: boolean = false;

  estadoInfiniteScroll = false;

  constructor(private usuarioService: UsuarioService,
    
    
    
    
    
    /*private auth: AuthService, 
    private eventService: EventService*/) { }

  ngOnInit() {
    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulos = res.favoritos;
    },
      error => {
        console.error(error);
      }
    );

  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.scroll(event, true);
    this.articulos = [];
    this.estadoInfiniteScroll = false;
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any, pull: boolean = false) {

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulos.unshift(...res.favoritos);

      if (event) {
        event.target.complete();
        if (res.favoritos.length === 0) {
          this.estadoInfiniteScroll = true;
          console.log('Todos los articulos favoritos se han cargado');
        }
      }
    });

  }

  // REFRECA LA PÁGINA PARA VER LOS CAMBIOS
  // ionViewDidEnter() {

  //   //refrescamos la página para que se muestren los datos del usuario
  //   this.auth.getUser().subscribe({
  //     next: (data) => {
  //       this.currentUser = data;
  //       console.log("refresco getuser");
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });

  //   //Refrescamos la página para que se muestren los eventos 
  //   this.eventService.findEventsByAuthorId(this.userId).subscribe({
  //     next: (data) => {
  //       this.myEvents = Object.values(data);
  //       this.myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ordenar los eventos por fecha
  //       console.log("refresco eventos")
  //       this.eventCount = this.myEvents.length;
  //       return this.myEvents;
  //     }
  //   });

  // }

}
