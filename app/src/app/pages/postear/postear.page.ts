import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

import { Geolocation } from '@capacitor/geolocation';

import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';


@Component({
  selector: 'app-postear',
  templateUrl: './postear.page.html',
  styleUrls: ['./postear.page.scss'],
})
export class PostearPage implements OnInit {

  images: string[] = [];

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

  constructor(private postService: PostsService,
              private route: Router,) { }

  ngOnInit() {
  }

  async crearPost() {
    await this.postService.crearPost(this.post);
    
    this.post = {
      mensaje: '',
      coords: null,
      posicion: false
    };

    this.images = [];

    this.route.navigateByUrl('/main/tabs/inicio');
  }

  async getPosicion() {
    if(!this.post.posicion) {
      this.post.coords = null;
      return;
    }

    this.cargandoGeoLoc = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const coordinates = await Geolocation.getCurrentPosition();

    if(coordinates) {
      const coords = `${coordinates.coords.latitude}, ${coordinates.coords.longitude}`;
      this.post.coords = coords;
      this.cargandoGeoLoc = false;
    } else {
      console.log('Error al obtener la localización');
    }

  
    console.log('Current position:', coordinates);

  }

  async abrirCamara() {
    const permiso = await Camera.checkPermissions();
    if(permiso.camera) {
      const image = await Camera.getPhoto(this.opcionesCamara);
      this.fotoTomada = image.webPath;
      if(this.fotoTomada) {
        this.images.push(this.fotoTomada);
        this.postService.subirImagen(this.fotoTomada);
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
        this.images.push(this.fotoTomada);
        this.postService.subirImagen(this.fotoTomada);
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
