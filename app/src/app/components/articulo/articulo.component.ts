import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articulo, Usuario } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;
const url_local = environment.url;

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.scss'],
})
export class ArticuloComponent implements OnInit {

  @Input() articulo: Articulo = {};

  articulosFavoritos: Articulo[] = [];

  usuario: Usuario = {};

  deshabilitado: boolean = true;

  esFavorito: boolean = false;

  constructor(private router: Router,
    private usuarioService: UsuarioService,
    private http: HttpClient) { }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulosFavoritos = res.favoritos;

      this.compruebaFavoritos(this.articulosFavoritos);

    });

  }

  favorito(event: Event) {
    event.stopPropagation();

    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    const articuloId = this.articulo._id;

    this.http.post(`${url}/usuario/favoritos/${articuloId}`, {}, { headers }).subscribe(
      (res: any) => {
        const favoritosActualizados = res.favoritos;
        this.esFavorito = !this.esFavorito;

        // Emitir los favoritos actualizados
        this.usuarioService.actualizarFavoritos(favoritosActualizados);
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  compruebaFavoritos(articulos: Articulo[]) {
    if(articulos.some(articuloFavorito => articuloFavorito._id === this.articulo._id)) {
      this.esFavorito = true;
    }
  }

  irAlArticulo(id: string) {
    this.router.navigate(['/user/item/' + id]);
  }

}
