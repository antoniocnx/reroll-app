import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController } from '@ionic/angular';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService,
    private articuloService: ArticulosService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  ionViewDidEnter() {
    this.usuario = this.usuarioService.getUsuario();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres cerrar la sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.usuarioService.logout();

            this.articuloService.paginaArticulos = 0;
          }
        }
      ]
    });

    await alert.present();
  }
}
