import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import * as DOMPurify from 'dompurify';

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
    private alertController: AlertController,
    private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  cerrarModal() {
    this.modalController.dismiss();
  }

  async enviarReporte() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    // const motivoSanitizer = this.sanitizer.sanitize(SecurityContext.HTML, this.motivo);
    const motivoSanitizer = DOMPurify.sanitize(this.motivo);
  
    const mensaje = {
      motivo: motivoSanitizer
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
