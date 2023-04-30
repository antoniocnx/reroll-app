import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

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
    this.usuarioService.getFavoritos().subscribe(res => {
        this.articulos = res.favoritos;
        console.log('FAVORITOS: ', this.articulos);
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

}
