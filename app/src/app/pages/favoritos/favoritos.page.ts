import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';
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

  constructor(private storage: StorageService,
    private usuarioService: UsuarioService,
    private articulosService: ArticulosService) { }

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

    this.articulosService.getArticulos(pull)
      .subscribe(resp => {
        console.log(resp);
        this.articulos.push(...resp.articulos);

        if (event) {
          event.target.complete();
          if (resp.articulos.length === 0) {
            this.estadoInfiniteScroll = true;
            console.log('Todos los articulos se han cargado');
          }
        }
      })

  }

}
