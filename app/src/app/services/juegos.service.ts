import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { /*Juego,*/ RespuestaPost } from '../interfaces/interfaces';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})

export class JuegosService {

  paginaPosts = 0;

  constructor(private http: HttpClient) { }
  
  getJuegos() {

    this.paginaPosts++;

    return this.http.get<RespuestaPost>(`${url}/posts/?pagina=${this.paginaPosts}`);
  }

  // private _juegos: Juego[] = [
  //   {
  //     nombre: 'Monopoly',
  //     categoria: 'Party',
  //     precio: 20,
  //     descripcion: 'Esto es el Monopoly'
  //   },
  //   {
  //     nombre: 'Risk',
  //     categoria: 'Estrategia',
  //     precio: 30,
  //     descripcion: 'Esto es el Risk'
  //   },
  //   {
  //     nombre: 'D&D',
  //     categoria: 'Rol',
  //     precio: 50,
  //     descripcion: 'Esto es D&D'
  //   },
  //   {
  //     nombre: 'Uno',
  //     categoria: 'Cartas',
  //     precio: 10,
  //     descripcion: 'Esto es el Uno'
  //   },
  //   {
  //     nombre: 'Test',
  //     categoria: 'Cosas',
  //     precio: 10,
  //     descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis suscipit est, ac iaculis erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed sed blandit est. Suspendisse gravida dapibus tellus, at vehicula justo pharetra quis. Vivamus vitae lobortis sem, nec ullamcorper tortor. Aliquam sodales dolor sed ex varius, id malesuada mauris sollicitudin. Cras et euismod diam. Mauris malesuada augue orci, in porttitor risus placerat ac. Fusce a metus ligula. Etiam faucibus mollis mattis. Nullam placerat vel risus ac suscipit.'
  //   }
  // ];

  // get juegos(): Juego[] {
  //   return [...this._juegos];
  // }


}
