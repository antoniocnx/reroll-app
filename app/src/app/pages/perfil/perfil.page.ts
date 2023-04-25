import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService,
              private postsService: PostsService) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  logout() {
    this.usuarioService.logout();

    // Hace falta restablecer el valor de paginaPost a 0 para que al hacer logout y luego ingresar con otro usuario
    // se muestren los posts. De lo contrario empieza a buscar en la página 1.
    this.postsService.paginaPosts = 0;
  }

}
