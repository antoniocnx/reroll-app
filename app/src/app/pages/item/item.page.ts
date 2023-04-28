import { Component, OnInit } from '@angular/core';
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

  constructor(private activatedRoute: ActivatedRoute, private articulosService: ArticulosService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.articulosService.getArticuloById(id).subscribe(data => {
        this.articulo = data;
        console.log('ITEM PAGE TS: ', this.articulo);
      });
    }
  }

}
