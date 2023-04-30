import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
})
export class ArticulosComponent implements OnInit {

  @Input() articulos: Articulo[] = [];

  esFavorito: boolean = false;

  constructor(private storage: StorageService,
              private router: Router) { }

  ngOnInit() { this.esFavorito = this.storage.getFavorito(); }

  favorito() {
    this.storage.cambiaFavorito();
    
    this.esFavorito = this.storage.getFavorito();

  }

  irAlArticulo(id: string) {
    this.router.navigate(['/user/item/' + id]);
  }

}
