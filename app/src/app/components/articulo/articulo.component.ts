import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articulo } from 'src/app/interfaces/interfaces';
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

  esFavorito: boolean = false;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private articulosService: ArticulosService, 
    private http: HttpClient) { }
  
  ngOnInit() {
    // this.route.paramMap.subscribe(params => {
    //   const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
    //   this.articulosService.getArticuloById(id).then(async res => {
    //     this.articulo = res;
    //   })
    // });

    this.usuarioService.getFavoritos().subscribe(res => {
      this.articulosFavoritos = res.favoritos;

      this.esFavorito = this.articulosFavoritos.some(articuloFavorito => articuloFavorito._id === this.articulo._id);

    });

    // this.compruebaFavorito();
  }

  favorito(event: Event) {
    event.stopPropagation();
    
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    
    const articuloId = this.articulo._id;
    
    this.http.post(`${ url }/usuario/favoritos/${ articuloId }`, {}, { headers }).subscribe(
      (res: any) => {
        this.esFavorito = !this.esFavorito;
      },
      (err: any) => {
        console.error(err);
      }
    );

    this.esFavorito != this.esFavorito;

  }
  
  irAlArticulo(id: string) {
    this.router.navigate(['/user/item/' + id]);
  }

  // compruebaFavorito() {
  //   return this.esFavorito = this.articulosFavoritos.some(articuloFavorito => articuloFavorito._id === this.articulo._id);
  // }

}
