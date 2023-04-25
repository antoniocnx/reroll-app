import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  formSignup: FormGroup = this.formBuilder.group ({
    nombre: ['Test 2', Validators.required],
    apellidos: ['Test', Validators.required],
    email: ['test2@test.com', [Validators.required, Validators.email, this.emailAdminNoValido()] ],
    password: ['123456', [ Validators.required, Validators.minLength(6) ] ],
    nacimiento: [(new Date('2000-01-01')), Validators.required],
    sexo: ['Mujer', Validators.required],
    direccion: ['Calle Prueba', Validators.required],
    ciudad: ['Prueba', Validators.required],
    localidad: ['Prueba', Validators.required],
    pais: ['Prueba', Validators.required],
    cp: [101010, Validators.required],
    avatar: ['av-robin.png']
  })

  isTypePassword: boolean = true;
  isLoading: boolean = false;

  // formSignup: FormGroup = new FormGroup ({
  //     nombre: new FormControl('Test 4'),
  //     apellidos: new FormControl('Apellidos'),
  //     email: new FormControl('test3@test.com'),
  //     password: new FormControl('123456'),
  //     nacimiento: new FormControl(new Date('01-01-2000')),
  //     sexo: new FormControl('Mujer'),
  //     direccion: new FormControl('Madrid'),
  //     ciudad: new FormControl('Madrid'),
  //     localidad: new FormControl('Madrid'),
  //     pais: new FormControl('España'),
  //     cp: new FormControl(10227),
  //     avatar: new FormControl('av-3.png')
  // })

  constructor(private usuarioService: UsuarioService,
    private navCrtl: NavController,
    private interfazUsuario: InterfazUsuarioService,
    private formBuilder: FormBuilder) { }

  ngOnInit() { }

  // Registro sin login automático
  // async signup(formSignup: FormGroup) {
  //   if(formSignup.invalid) {
  //     return;
  //   }

  //   const valido = await this.usuarioService.registro(formSignup.value);

  //   if(!valido) {
  //     // Ir a tabs
  //     this.navCrtl.navigateRoot('/login', { animated: true });
      
  //   } else {
  //     // Alerta de error
  //     this.interfazUsuario.alertaLogin('Ya existe ese usuario.');
  //   }
  // }

  // Registro con login automático
  async signup(formSignup: FormGroup) {
    if(formSignup.invalid) {
      return;
    }

    const valido = await this.usuarioService.registro(formSignup.value);

    if(!valido) {
      // Ir a tabs
      const ok = await this.usuarioService.login(this.formSignup.value.email, this.formSignup.value.password);

      if(ok) {
        // Ir a tabs
        this.navCrtl.navigateRoot('/user/inicio', { animated: true });
      }
      
    } else {
      // Alerta de error
      this.interfazUsuario.alertaLogin('Ya existe ese usuario.');
    }
  }

  emailAdminNoValido(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const email = control.value;
      if (email && email.toLowerCase().endsWith('@admin.com')) {
        return { 'emailNoPermitido': true };
      }
      return null;
    };
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

}
