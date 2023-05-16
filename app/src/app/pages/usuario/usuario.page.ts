import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Articulo, Usuario, Valoracion } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ArticulosService } from 'src/app/services/articulos.service';
import { ModalController } from '@ionic/angular';
import { ValoracionComponent } from 'src/app/components/valoracion/valoracion.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  usuarioActual: Usuario = {};

  articuloActual: Articulo = {};

  valoraciones: Valoracion[] = [];

  constructor(private location: Location,
              private route: ActivatedRoute,
              private usuarioService: UsuarioService,
              private articulosService: ArticulosService,
              private modalController: ModalController) { }

  ngOnInit() {
    const idUsuario = this.route.snapshot.paramMap.get('id');
    const articulo = history.state.articulo; // Recuperar el objeto articulo del state
    const idArticulo = articulo._id;

    if(idArticulo) {
      this.articulosService.getArticuloById(idArticulo).then(res => {
        this.articuloActual = res;
    
        this.usuarioActual = res.usuario;
        if(this.usuarioActual._id) {
          this.usuarioService.getValoraciones(this.usuarioActual._id).subscribe(
            valoraciones => {
              this.valoraciones = valoraciones;
              console.log(this.valoraciones);
            }
          );
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  getEstrellas(value: number): any[] {
    return Array(value);
  }

  estrellasMedia(puntuacion: number): any[] {
    const stars = [];
    for (let i = 0; i < puntuacion; i++) {
      stars.push(i);
    }
    return stars;
  }
  

  getValoracionMedia(valoraciones: Valoracion[]): number {
    if (valoraciones.length === 0) {
      return 0;
    }
    const suma = valoraciones.reduce((acumulador, valoracion) => acumulador + valoracion.puntuacion, 0);
    const media = suma / valoraciones.length;
    return Math.round(media);
  }

  async hacerValoracion() {
    const modal = await this.modalController.create({
      component: ValoracionComponent,
      componentProps: {
        usuarioId: this.usuarioActual._id
      }
    });

    await modal.present();
  }
  

}
