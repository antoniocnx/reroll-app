import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busqueda'
})
export class BusquedaPipe implements PipeTransform {

  //Pipe para buscar un valor en un array por un campo específico
  transform(items: any[], textoBusqueda: string, categoriaBusqueda: string): any[] {
    if (!items || !textoBusqueda) return items;

    //Buscar el valor en el array por el campo específico
    // return items.filter(item => item[categoriaBusqueda].toLowerCase().includes(textoBusqueda.toLowerCase()));

    
    return items.filter(item => {
      const valorCampo = item[categoriaBusqueda];
      if (categoriaBusqueda === "precio") {
        // Si la búsqueda es por precio, convertir el valor a número antes de comparar
        return Number(valorCampo) === Number(textoBusqueda);
      } else {
        // Si la búsqueda es por nombre o categoría, comparar en minúsculas
        return valorCampo.toLowerCase().includes(textoBusqueda.toLowerCase());
      }
    });

  }
}
