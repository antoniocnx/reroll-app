import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Reporte } from 'src/app/interfaces/interfaces';
import { ArticulosService } from 'src/app/services/articulos.service';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {

  reportes: Reporte[] = [];

  articuloInfo: boolean = false;

  constructor(private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private articulosService: ArticulosService) { }

  ngOnInit() {
    this.http.get<Reporte[]>(`${url}/reporte`).subscribe(
      (reportes: Reporte[]) => {
        this.reportes = reportes;
      },
      (error: any) => {
        console.error('Error al obtener los reportes:', error);
      }
    );
  }

  // FUNCIÓN DEL REFRESHER
  refresh(event: any) {
    this.http.get<Reporte[]>(`${url}/reporte`).subscribe(
      (reportes: Reporte[]) => {
        this.reportes = reportes;
        event.target.complete();
      },
      (error: any) => {
        console.error('Error al obtener los reportes:', error);
      }
    );
  }

  // irAlArticulo(id?: string) {
  //   if(id) {
  //     console.log(id);
  //     this.router.navigate(['/user/item/' + id]);
  //   }
  // }

  async eliminarReporte(id?: string) {
    if (id) {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: '¿Estás seguro de que quieres eliminar este reporte?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.http.delete(`${url}/reporte/${id}`).subscribe(
                (response) => {
                  console.log('Reporte eliminado:', response);
                  // Realiza las acciones necesarias después de eliminar el reporte
                },
                (error) => {
                  console.error('Error al eliminar el reporte:', error);
                  // Realiza las acciones necesarias en caso de error
                }
              );
            },
          },
        ],
      });

      await alert.present();
    }
  }

  async eliminarArticulo(articuloId?: string) {
    if (articuloId) {
      const alert = await this.alertController.create({
        header: '¿Quieres eliminar este artículo?',
        message: 'Una vez eliminado el artículo no se podrá recuperar.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            handler: () => {
              if (articuloId) {
                this.articulosService.eliminarArticulo(articuloId).subscribe(
                  response => {
                    console.log(response.message);
                    for (let i = 0; i < this.reportes.length; i++) {
                      if (this.reportes[i].articulo?._id == articuloId) {
                        this.http.delete(`${url}/reporte/${this.reportes[i]._id}`).subscribe(
                          (response) => {
                            console.log('Reporte eliminado:', response);
                            // Realiza las acciones necesarias después de eliminar el reporte
                          },
                          (error) => {
                            console.error('Error al eliminar el reporte:', error);
                            // Realiza las acciones necesarias en caso de error
                          }
                        )
                      };//
                    }
                  },
                  error => console.log(error)
                );
              }
            }
          }
        ]
      });

      await alert.present();
    }
  }

  mostrarArticulo() {
    this.articuloInfo = !this.articuloInfo;
  }

}
