import { Component, OnInit } from '@angular/core';
import { Administrador } from 'src/app/interfaces/interfaces';
import { AdministradorService } from 'src/app/services/administrador.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfil-admin.page.html',
  styleUrls: ['./perfil-admin.page.scss'],
})
export class PerfilAdminPage implements OnInit {

  admin: Administrador = {};

  constructor(private adminService: AdministradorService,
              private postsService: PostsService) { }

  ngOnInit() {
    this.admin = this.adminService.getAdmin();
  }

  logout() {
    this.adminService.logout();

    // Hace falta restablecer el valor de paginaPost a 0 para que al hacer logout y luego ingresar con otro usuario
    // se muestren los posts. De lo contrario empieza a buscar en la página 1.
    this.postsService.paginaPosts = 0;
  }

}
