import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { AdministradorService } from '../services/administrador.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanLoad {

  constructor(private usuarioService: UsuarioService, private administradorService: AdministradorService, private router: Router) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.usuarioService.validaToken() || this.administradorService.validaToken();
  }
  
  // canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return forkJoin([
  //     this.usuarioService.validaToken(),
  //     this.administradorService.validaToken()
  //   ]).pipe(
  //     map(([isUsuarioValido, isAdministradorValido]) => {
  //       if (isUsuarioValido || isAdministradorValido) {
  //         return true; // Si alguno de los tokens es válido, permite la carga de la ruta
  //       } else {
  //         // Si ninguno de los tokens es válido, redirige a una página de error o a donde desees
  //         return this.router.parseUrl('/error');
  //       }
  //     })
  //   );
  // }
}
