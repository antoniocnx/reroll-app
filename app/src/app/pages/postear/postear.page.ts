import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';

import { Articulo, LocalFile } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-postear',
  templateUrl: './postear.page.html',
  styleUrls: ['./postear.page.scss'],
})
export class PostearPage implements OnInit {

  galeria: string[] = [];

  formData = new FormData();

  formPost: FormGroup = this.formBuilder.group({
    fecha: [new Date()],
    nombre: ['', Validators.required],
    precio: ['', Validators.required],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    estado: ['En venta', Validators.required],
    envio: ['', Validators.required]
  });

  articulo: Articulo = {
    fecha: new Date(),
    nombre: '',
    precio: 0,
    categoria: '',
    descripcion: '',
    estado: 'En venta',
    envio: '',
    galeria: [],
  };

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

  ngOnInit() { }

  async postear() {
    this.formData.append('fecha', this.formPost.get('fecha')?.value);
    this.formData.append('nombre', this.formPost.get('nombre')?.value);
    this.formData.append('precio', this.formPost.get('precio')?.value);
    this.formData.append('categoria', this.formPost.get('categoria')?.value);
    this.formData.append('descripcion', this.formPost.get('descripcion')?.value);
    this.formData.append('localizacion', this.formPost.get('localizacion')?.value);
    this.formData.append('estado', this.formPost.get('estado')?.value);
    this.formData.append('envio', this.formPost.get('envio')?.value);

    await this.articuloService.crearArticulo(this.formData)
      .then((result) => {
        console.log(result);
        this.formData.delete;
        this.formData.delete('files');
        this.route.navigateByUrl('/user/inicio');
      }).catch((err) => {
        console.log(err);
      });

  }

  async abrirCamara() {
    const permiso = await Camera.checkPermissions();
    if (permiso.camera) {
      const imagen = await Camera.getPhoto(this.opcionesCamara);

      if (imagen.webPath) {
        // Verificar si la imagen ya existe en la matriz galeria
        if (!this.galeria.includes(imagen.webPath)) {
          const imageBlob = await fetch(imagen.webPath).then(r => r.blob());
          const imageFile = new File([imageBlob], "image", { type: "image/jpeg" });

          this.formData.append('files', imageFile);

          this.galeria.push(imagen.webPath);
        }
      }

    } else {
      console.log('Sin permiso para acceder a la cámara');
    }
  }

  async abrirGaleria() {
    const permiso = await Camera.checkPermissions();
    if (permiso.photos) {
      const imagen = await Camera.getPhoto(this.opcionesGaleria);

      if (imagen.webPath) {
        // Verificar si la imagen ya existe en la matriz galeria
        if (!this.galeria.includes(imagen.webPath)) {
          const imageBlob = await fetch(imagen.webPath).then(r => r.blob());
          // Obtener el nombre del archivo original
          const nombreArchivo = imagen.webPath.split('/').pop();
          if (nombreArchivo) {
            const imageFile = new File([imageBlob], nombreArchivo, { type: "image/jpeg" });
            this.formData.append('files', imageFile);
            this.galeria.push(imagen.webPath);
          }
        }
      }

    } else {
      console.log('Sin permiso para acceder a la galería');
    }
  }

  eliminarImagen(index: number) {
    this.galeria.splice(index, 1); // Eliminar imagen del array galeria
    this.formData.delete(`files[${index}]`); // Elimina la imagen del formulario
  }

}
