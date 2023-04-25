import { Component, Input, OnInit, ViewChild } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  mapboxToken: string = 'pk.eyJ1IjoiYW50b25pb2NuIiwiYSI6ImNsZXJjeHJzYzB2ZXkzeG83ZGtuM2wwOXcifQ.xE6jhEUBq8K7lGqNGFoK6Q';
  @Input() coords: string = '';
  @ViewChild('mapaLocal', { static: true}) mapa: any;

  constructor() { }

  ngOnInit() {
    const latLng = this.coords.split(',');
    const lat = Number(latLng[0]); 
    const lng = Number(latLng[1]); 
 
    // Instanciar mapbox para asignarle el token
    const mapbox = (mapboxgl as typeof mapboxgl);
    mapbox.accessToken = this.mapboxToken;
 
    // Crear instancia del mapa
    const map = new mapbox.Map({
      // container: 'map',
      container: this.mapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 15
    });
 
    // Posicionar un marcador en las coordenadas del post
    const marker = new mapbox.Marker()
      .setLngLat( [ lng, lat ])
      . addTo( map );
  }

}
