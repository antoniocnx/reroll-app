import { Component, OnInit } from '@angular/core';
import { Articulo, Usuario } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mis-articulos',
  templateUrl: './mis-articulos.page.html',
  styleUrls: ['./mis-articulos.page.scss'],
})
export class MisArticulosPage implements OnInit {

  usuario: Usuario = {};

  articulos: Articulo[] = [];

  estadoInfiniteScroll = false;

  constructor(private usuariosService: UsuarioService,
              private articulosService: ArticulosService,
              private location: Location) { }
  
  // ionViewDidEnter() {
  //   this.articulosService.getArticulos();
  // }

  ngOnInit() {

    this.usuario =  this.usuariosService.getUsuario();
    this.scroll();
  
  }

  // REFRESHER
  refresh(event: any) {
    this.scroll(event);
    this.articulos = [];
    this.estadoInfiniteScroll = false;
  }

  // INFINITE SCROLL
  scroll(event?: any) {

    this.articulosService.getTodosArticulos()
      .subscribe(resp => {
      const misArticulos = resp.articulos.filter(articulo => articulo.usuario?._id === this.usuario._id);
      this.articulos.unshift(...misArticulos);
      
      if(event) {
        event.target.complete();
        if(resp.articulos.length === 0) {
          this.estadoInfiniteScroll = true;
        }
      }
    });
  }

  goBack() {
    this.location.back();
  }

}
