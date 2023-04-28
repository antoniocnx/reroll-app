import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  public articulo: Articulo = {};

  constructor(private route: ActivatedRoute, private articulosService: ArticulosService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? ''; // Usa una cadena vacía si params.get('id') devuelve null
      this.articulosService.getArticuloById(id).subscribe(res => {
        this.articulo = res;
        console.log('ARTICULO EN ITEM', this.articulo);
      });
    });

  }

}
