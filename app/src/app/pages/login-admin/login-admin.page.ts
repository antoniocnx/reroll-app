import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AdministradorService } from 'src/app/services/administrador.service';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {

  formLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, this.noScriptValidator]],
    password: ['', [Validators.required, this.noScriptValidator]]
  })

  isTypePassword: boolean = true;
  isLogin = false;

  constructor(private adminService: AdministradorService,
    private navCrtl: NavController,
    private interfazUsuario: InterfazUsuarioService,
    private formBuilder: FormBuilder) { }

  ngOnInit() { }

  async login(formLogin: FormGroup) {
    if (formLogin.invalid) {
      return;
    }

    const valido = await this.adminService.login(this.formLogin.value.email, this.formLogin.value.password);

    if (valido) {
      // Ir a tabs
      this.navCrtl.navigateRoot('/admin/reportes', { animated: true });
    } else {
      // Alerta de error
      this.interfazUsuario.alertaLogin('Administrador o contraseña incorrecto.');
    }

  }

  // Verificar si el valor contiene scripts maliciosos
  noScriptValidator(control: FormControl) {
    const value = control.value;

    if (/\<|\>|javascript:|on\w+\s*=/.test(value)) {
      return { noHTML: true };
    }

    return null;
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }


}
