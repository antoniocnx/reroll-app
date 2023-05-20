import { Component, OnInit } from '@angular/core';
import { Administrador, Articulo, Reporte, Usuario } from 'src/app/interfaces/interfaces';
import { AdministradorService } from 'src/app/services/administrador.service';
import { ArticulosService } from 'src/app/services/articulos.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

const url = environment.heroku_url;

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  usuariosTotales: Usuario[] = [];

  articulosTotales: Articulo[] = [];

  administradoresTotales: Administrador[] = [];

  reportesTotales: Reporte[] = [];



  constructor(private usuarioService: UsuarioService, 
              private articulosService: ArticulosService,
              private adminService: AdministradorService,
              private reporteService: ReporteService) { }

  ngOnInit() {
    this.usuarioService.getNumUsuarios().subscribe(res => {
      this.usuariosTotales = res;
    });

    this.articulosService.getNumArticulos().subscribe(res => {
      this.articulosTotales = res.articulos;
    });

    this.adminService.getNumAdmins().subscribe(res => {
      this.administradoresTotales = res;
    });

    this.reporteService.getReportes().subscribe(res => {
      this.reportesTotales = res;
    })

  }

}
