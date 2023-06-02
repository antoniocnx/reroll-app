import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.scroll();
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.scroll(event);
    this.articulos = [];
    this.estadoInfiniteScroll = false;
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any) {

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulos.unshift(...res.favoritos);

      if (event) {
        event.target.complete();
        if (res.favoritos.length === this.articulos.length) {
          this.estadoInfiniteScroll = true;
        }
      }

    });

  }

}
