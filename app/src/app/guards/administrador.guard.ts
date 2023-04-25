import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdministradorService } from '../services/administrador.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorGuard implements CanLoad {

  constructor(private adminService: AdministradorService) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.adminService.validaToken();
  }
  
}
