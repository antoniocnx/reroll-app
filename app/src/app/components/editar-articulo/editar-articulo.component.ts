import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ArticulosService } from 'src/app/services/articulos.service';

@Component({
  selector: 'app-editar-articulo',
  templateUrl: './editar-articulo.component.html',
  styleUrls: ['./editar-articulo.component.scss'],
})
export class EditarArticuloComponent implements OnInit {

  articuloId: string = '';

  formData = new FormData();

  formPost: FormGroup = this.formBuilder.group({
    nombre: [''],
    precio: [''],
    categoria: [''],
    descripcion: ['', Validators.maxLength(200)],
    estado: [''],
    envio: ['']
  });

  constructor(private articulosService: ArticulosService,
              private modalController: ModalController,
              private formBuilder: FormBuilder) {}

  ngOnInit() {}
  
  cerrarModal() {
    this.modalController.dismiss();
  }

  async actualizar() {
    const nuevoArticulo = {
      nombre: this.formPost.get('nombre')?.value,
      precio: this.formPost.get('precio')?.value,
      categoria: this.formPost.get('categoria')?.value,
      descripcion: this.formPost.get('descripcion')?.value,
      estado: this.formPost.get('estado')?.value,
      envio: this.formPost.get('envio')?.value
    };
    
    await this.articulosService.actualizarArticulo(this.articuloId, nuevoArticulo)
    .subscribe(
      (res) => {
        console.log(res);
        // Realiza las acciones necesarias después de actualizar el artículo
        this.modalController.dismiss();
      },
      (error) => {
        console.log(error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }
  
}

// this.formData.delete;
// this.cerrarModal();