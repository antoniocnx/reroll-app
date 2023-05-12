import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Administrador } from 'src/app/interfaces/interfaces';
import { AdministradorService } from 'src/app/services/administrador.service';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfil-admin.page.html',
  styleUrls: ['./perfil-admin.page.scss'],
})
export class PerfilAdminPage implements OnInit {

  admin: Administrador = {};

  constructor(private adminService: AdministradorService,
    private articuloService: ArticulosService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.admin = this.adminService.getAdmin();
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
            this.adminService.logout();

            this.articuloService.paginaArticulos = 0;
          }
        }
      ]
    });

    await alert.present();
  }

}
