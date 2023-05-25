import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.scss'],
})
export class ValoracionComponent implements OnInit {

  puntuacion: number = 0;
  comentario: string = '';
  usuarioId: string = '';

  constructor(private usuarioService: UsuarioService,
              private modalController: ModalController,
              private http: HttpClient,
              private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  cerrarModal() {
    this.modalController.dismiss();
  }

  enviarValoracion() {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    const comentarioSanitizer = this.sanitizer.sanitize(SecurityContext.HTML, this.comentario);
    
    const valoracion = {
      puntuacion: this.puntuacion,
      comentario: comentarioSanitizer,
    };
  
    // Realiza la llamada al servidor
    this.http.post<any>(`${ url }/usuario/${ this.usuarioId }/valoracion`, valoracion, { headers })
      .subscribe(
        response => {
          console.log('Valoración enviada correctamente:', response);
          this.modalController.dismiss();
        },
        error => {
          console.error('Error al enviar la valoración:', error);
          // Maneja el error de acuerdo a tus necesidades (por ejemplo, mostrar un mensaje de error al usuario)
        }
      );
  }

}
