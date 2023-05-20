import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent implements OnInit {

  articuloId: string = '';

  motivo: string = '';

  constructor(private usuarioService: UsuarioService,
    private modalController: ModalController,
    private http: HttpClient,
    private alertController: AlertController) { }

  ngOnInit() { }

  cerrarModal() {
    this.modalController.dismiss();
  }

  async enviarReporte() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
  
    const mensaje = {
      motivo: this.motivo
    };
  
    const alert = await this.alertController.create({
      header: 'Confirmar reporte',
      message: '¿Estás seguro de reportar este artículo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.http.post(`${url}/reporte/${this.articuloId}`, mensaje, { headers })
              .subscribe(
                response => {
                  console.log('Reporte guardado:', response);
                  this.modalController.dismiss();
                },
                error => {
                  console.error('Error al guardar el reporte:', error);
                }
              );
          }
        }
      ]
    });
  
    await alert.present();
  }

}