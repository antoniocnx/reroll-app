import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Articulo, Usuario, Valoracion } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  usuarioActual: Usuario = {};

  articuloActual: Articulo = {};

  constructor(private location: Location,
              private route: ActivatedRoute,
              private articulosService: ArticulosService) { }

  ngOnInit() {
    const idUsuario = this.route.snapshot.paramMap.get('id');
    const articulo = history.state.articulo; // Recuperar el objeto articulo del state
    const idArticulo = articulo._id;

    if(idArticulo) {
      this.articulosService.getArticuloById(idArticulo).then(res => {
        this.articuloActual = res;
        
        this.usuarioActual = res.usuario;
      });
    }
  }

  goBack() {
    this.location.back();
  }

  getValoracionMedia(valoraciones: Valoracion[]): number {
    if (valoraciones.length === 0) {
      return 0;
    }
    const suma = valoraciones.reduce((acumulador, valoracion) => acumulador + valoracion.puntuacion, 0);
    return suma / valoraciones.length;
  }
  

}
