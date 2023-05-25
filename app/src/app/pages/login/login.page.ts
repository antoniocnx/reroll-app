import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule, FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup = this.formBuilder.group({
    email: ['test1@test.com', [Validators.required, Validators.email, this.noScriptValidator]],
    password: ['123456', [Validators.required, this.noScriptValidator]]
  })

  isTypePassword: boolean = true;
  isLogin = false;

  constructor(private usuarioService: UsuarioService,
    private navCrtl: NavController,
    private interfazUsuario: InterfazUsuarioService,
    private formBuilder: FormBuilder) { }


  ngOnInit() { }

  async login(formLogin: FormGroup) {
    if (formLogin.invalid) {
      return;
    }

    // const valido = await this.usuarioService.login(this.loginUsuario.email, this.loginUsuario.password);
    const valido = await this.usuarioService.login(this.formLogin.value.email, this.formLogin.value.password);

    if (valido) {
      // Ir a tabs
      this.navCrtl.navigateRoot('/user/inicio', { animated: true });
    } else {
      // Alerta de error
      this.interfazUsuario.alertaLogin('Usuario o contraseña incorrecto.');
    }

  }

  // Verificar si el valor contiene scripts maliciosos
  noScriptValidator(control: FormControl) {
    const value = control.value;

    if (/\<|\>|javascript:|on\w+\s*=/.test(value)) {
      return { noHTML: true };
    }

    // if (/\<script.*\>|javascript:|on\w+\s*=/.test(value)) {
    //   return { noScript: true };
    // }

    return null;
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

}
