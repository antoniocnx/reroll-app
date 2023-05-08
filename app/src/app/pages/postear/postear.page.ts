import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Geolocation } from '@capacitor/geolocation';

import { Camera, CameraPhoto, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { Articulo, LocalFile } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';

const url = environment.heroku_url;

@Component({
  selector: 'app-postear',
  templateUrl: './postear.page.html',
  styleUrls: ['./postear.page.scss'],
})
export class PostearPage implements OnInit {
  
  galeria: string[] = [];

  formPost: FormGroup = this.formBuilder.group({
    fecha: [new Date()],
    nombre: ['', Validators.required],
    precio: ['', Validators.required],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(200)] ],
    localizacion: [''],
    estado: ['En venta', Validators.required],
    envio: ['', Validators.required],
    galeria: this.formBuilder.array([])
    // galeria: []
  });
  
  articulo: Articulo ={
    fecha: new Date(),
    nombre: '',
    precio: 0,
    categoria: '',
    descripcion: '',
    localizacion: '',
    estado: 'En venta',
    envio: '',
    galeria: [],
    // usuario: 
  };

  valorFormulario() {
    console.log(this.formPost.value);
  }

  cargandoGeoLoc = false;

  fotoTomada: string | undefined;

  post = {
    mensaje: '',
    coords: null as null | string,
    posicion: false
  }

  opcionesCamara: ImageOptions = {
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri, // Alternativa -> CameraResultType.Base64
    correctOrientation: true,
    saveToGallery: true,
    source: CameraSource.Camera,
    promptLabelHeader: 'Escoge una opción:'
  }

  opcionesGaleria: ImageOptions = {
    quality: 90,
    resultType: CameraResultType.Uri, // Alternativa -> CameraResultType.Base64
    source: CameraSource.Photos
  }

  constructor(private http: HttpClient, private articuloService: ArticulosService,
              private route: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() { }

  async postear(formPost: FormGroup) {
    if(formPost.invalid) {
      return;
    }

    await this.articuloService.crearArticulo(this.formPost.value);

    // await this.crearArticulos(this.formPost);
    
    this.articulo = {};

    this.galeria = [];

    this.route.navigateByUrl('/user/inicio');
  }

  async getPosicion() {
    // if(!this.articulo.posicion) {
    //   this.articulo.localizacion = null;
    //   return;
    // }

    this.cargandoGeoLoc = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const coordenadas = await Geolocation.getCurrentPosition();

    if(coordenadas) {
      const localizacion = `${coordenadas.coords.latitude}, ${coordenadas.coords.longitude}`;
      this.articulo.localizacion = localizacion;
      this.cargandoGeoLoc = false;
    } else {
      console.log('Error al obtener la localización');
    }

  
    console.log('Current position:', coordenadas);

  }

  async abrirCamara() {
    const permiso = await Camera.checkPermissions();
    if(permiso.camera) {
      const imagen = await Camera.getPhoto(this.opcionesCamara);

      if(imagen.webPath) {
        const imageBlob = await fetch(imagen.webPath).then(r => r.blob());
        const imageFile = new File([imageBlob], "image", { type: "image/jpeg" });
      
        // Obtener el FormArray de 'galeria'
        const galeria = this.formPost.get('galeria') as FormArray;
        
        // Agregar el archivo a 'galeria'
        galeria.push(this.formBuilder.control(imageFile));
      }

    } else {
      console.log('Sin permiso para acceder a la cámara');
    }
  }

  async abrirGaleria() {
    const permiso = await Camera.checkPermissions();
    if(permiso.photos) {
      const imagen = await Camera.getPhoto(this.opcionesGaleria);
      
      if(imagen.webPath) {
        const imageBlob = await fetch(imagen.webPath).then(r => r.blob());
        const imageFile = new File([imageBlob], "image", { type: "image/jpeg" });
      
        // Obtener el FormArray de 'galeria'
        const galeria = this.formPost.get('galeria') as FormArray;
        
        // Agregar el archivo a 'galeria'
        galeria.push(this.formBuilder.control(imageFile));
      }
      
    } else {
      console.log('Sin permiso para acceder a la galería');
    }
  }

  async crearArticulo() {
    const formData = new FormData();
    formData.append('fecha', this.formPost.get('fecha')?.value);
    formData.append('nombre', this.formPost.get('nombre')?.value);
    formData.append('precio', this.formPost.get('precio')?.value);
    formData.append('categoria', this.formPost.get('categoria')?.value);
    formData.append('descripcion', this.formPost.get('descripcion')?.value);
    formData.append('localizacion', this.formPost.get('localizacion')?.value);
    formData.append('estado', this.formPost.get('estado')?.value);
    formData.append('envio', this.formPost.get('envio')?.value);
  
    // Agregar las imágenes capturadas al objeto FormData
    const galeria = this.formPost.get('galeria')?.value;
    for (let i = 0; i < galeria.length; i++) {
      formData.append('files', galeria[i], galeria[i].name);
    }
  
    try {
      const result = await this.articuloService.crearArticulo(formData);
      if (result) {
        this.route.navigateByUrl('/user/inicio');;
      }
    } catch (error) {
      console.log(error);
    }
  }

}
