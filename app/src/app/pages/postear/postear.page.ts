import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

import { Geolocation } from '@capacitor/geolocation';

import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { Articulo } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-postear',
  templateUrl: './postear.page.html',
  styleUrls: ['./postear.page.scss'],
})
export class PostearPage implements OnInit {

  formPost: FormGroup = this.formBuilder.group({
    fecha: [new Date()],
    nombre: ['', Validators.required],
    precio: ['', Validators.required],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(200)] ],
    localizacion: [''],
    estado: ['En venta', Validators.required],
    envio: ['', Validators.required],
    galeria: []
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

  galeria: string[] = [];

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

  constructor(private articuloService: ArticulosService,
              private route: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  async postear(formPost: FormGroup) {
    if(formPost.invalid) {
      return;
    }

    await this.articuloService.crearArticulo(this.formPost.value);
    
    this.articulo = {};

    this.galeria = [];

    this.route.navigateByUrl('/user/inicio');
  }

  async crearArticulo() {
    await this.articuloService.crearArticulo(this.articulo);
    
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
      const image = await Camera.getPhoto(this.opcionesCamara);
      this.fotoTomada = image.webPath;
      if(this.fotoTomada) {
        this.galeria.push(this.fotoTomada);
        // this.articuloService.subirImagen(this.fotoTomada);
      }


    } else {
      console.log('Sin permiso para acceder a la cámara');
    }
  }

  async abrirGaleria() {
    const permiso = await Camera.checkPermissions();
    if(permiso.photos) {
      const image = await Camera.getPhoto(this.opcionesGaleria);
      this.fotoTomada = image.webPath;
      if(this.fotoTomada) {
        this.galeria.push(this.fotoTomada);
        // this.articuloService.subirImagen(this.fotoTomada);
      }

    } else {
      console.log('Sin permiso para acceder a la galería');
    }
  }

  // procesarImg(options: CameraOptions) {
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64 (DATA_URL):
  //    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
  //    console.log(imageData);
 
  //    const img = window.Ionic.WebView.convertFileSrc(imageData);
  //    this.verKImg = img;
  //    console.log(img);
  //    this.postService.subirImagen(imageData);
  //    this.tempImages.push( img );
  //    }, (err) => {
  //     // Handle error
  //    });
  // }

}
