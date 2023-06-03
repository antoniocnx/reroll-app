import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/interfaces/interfaces';
import { BusquedaPipe } from 'src/app/pipes/busqueda.pipe';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  providers: [BusquedaPipe]
})
export class InicioPage implements OnInit {

  textoBusqueda: string = '';

  categoriaBusqueda: string = '';
  categoriaSeleccionada: string = '';

  articulos: Articulo[] = [];

  estadoInfiniteScroll = false;

  constructor(private articulosService: ArticulosService,
    private changeDetectorRef: ChangeDetectorRef,
    private busquedaPipe: BusquedaPipe) { }

  ngOnInit() {
    this.scroll();

    this.articulosService.nuevoArticulo.subscribe(arti => {
      this.articulos.unshift(arti);
    });
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.scroll(event, true);
    this.articulos = [];
    this.estadoInfiniteScroll = false;
  }

  // FUNCIÓN DEL INFINITE SCROLL
  scroll(event?: any, pull: boolean = false) {
    this.articulosService.getArticulos(pull).subscribe(resp => {
      const nuevosArticulos = resp.articulos.filter(articulo => articulo.estado !== 'Vendido');
      this.articulos.push(...nuevosArticulos);

      if (event) {
        event.target.complete();
        if (nuevosArticulos.length === 0) {
          this.estadoInfiniteScroll = true;
        }
      }

      // Forzar la detección de cambios
      this.changeDetectorRef.detectChanges();
    });
  }

  onCategoriaChange(event: any) {
    const categoriaSeleccionada = event.target.value;
  
    if (this.categoriaBusqueda === 'categoria' && categoriaSeleccionada !== 'categoria') {
      this.textoBusqueda = '';
    }
  
    this.categoriaBusqueda = categoriaSeleccionada;
    this.realizarBusqueda();
  }
  

  realizarBusqueda() {
    if (this.categoriaBusqueda === 'nombre') {
      // Realizar búsqueda por nombre
      this.articulos = this.busquedaPipe.transform(
        this.articulos,
        this.textoBusqueda,
        'nombre'
      );
    } else if (this.categoriaBusqueda === 'precio') {
      // Realizar búsqueda por precio
      this.articulos = this.busquedaPipe.transform(
        this.articulos,
        this.textoBusqueda,
        'precio'
      );
    } else if (this.categoriaBusqueda === 'categoria') {
      if (this.textoBusqueda !== '') {
        // Realizar búsqueda por categoría solo si se ha seleccionado una opción
        this.articulos = this.busquedaPipe.transform(
          this.articulos,
          this.textoBusqueda,
          'nombre'
        );
      } else {
        // No hacer nada si no se ha seleccionado ninguna opción
        this.articulos = this.busquedaPipe.transform(
          this.articulos,
          '',
          'nombre'
        );
      }
    }
  }
  

}
