import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Reporte } from '../interfaces/interfaces';

const url = environment.heroku_url;

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient) { }

  getReportes() {
    return this.http.get<Reporte[]>(`${url}/reporte`);
  }
}
