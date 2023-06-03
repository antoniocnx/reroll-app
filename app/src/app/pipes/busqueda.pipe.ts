import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busqueda'
})
export class BusquedaPipe implements PipeTransform {

  //Pipe para buscar un valor en un array por un campo específico  
  transform(items: any[], textoBusqueda: string, categoriaBusqueda: string): any[] {
    if (!items || !textoBusqueda) return items;

    if (categoriaBusqueda === 'precio' && textoBusqueda !== '') {
      const precioMaximo = Number(textoBusqueda);
      return items.filter(item => {
        const precio = Number(item.precio);
        return precio <= precioMaximo;
      });
    } else {
      return items.filter(item => {
        const valorCampo = item[categoriaBusqueda];
        return valorCampo && valorCampo.toLowerCase().includes(textoBusqueda.toLowerCase());
      });
    }
  }

}
