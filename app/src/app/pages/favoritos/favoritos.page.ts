import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { IonContent, ScrollDetail } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Articulo } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  articulos: Articulo[] = [];

  estadoInfiniteScroll = false;

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // this.usuarioService.favoritos$.subscribe((favoritos) => {
    //   this.articulos = favoritos;
    // });

    this.scroll();

  }

  ionViewDidEnter() {
    // Actualizar la lista de favoritos al entrar en la página
    this.actualizarFavoritos();
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.actualizarFavoritos();
    this.articulos = [];
    this.estadoInfiniteScroll = false;
    if (event) {
      event.target.complete();
    }
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any) {
    this.actualizarFavoritos();
    if (event) {
      event.target.complete();
    }
  }

  private actualizarFavoritos() {
    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulos = res.favoritos;

      if (res.favoritos.length === this.articulos.length) {
        this.estadoInfiniteScroll = true;
      }
    });
  }

}
