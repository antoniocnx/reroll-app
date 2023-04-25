import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AdministradorService } from 'src/app/services/administrador.service';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';

@Component({
  selector: 'app-signup-admin',
  templateUrl: './signup-admin.page.html',
  styleUrls: ['./signup-admin.page.scss'],
})
export class SignupAdminPage implements OnInit {

  formSignup: FormGroup = this.formBuilder.group ({
    nombre: ['Admin 2', Validators.required],
    apellidos: ['Admin', Validators.required],
    email: ['admin2@admin.com', [Validators.required, Validators.email, this.emailAdminNoValido()] ],
    password: ['123456', [ Validators.required, Validators.minLength(6) ] ],
    nacimiento: [(new Date('2000-01-01')), Validators.required],
    sexo: ['Mujer', Validators.required],
    direccion: ['Calle Prueba', Validators.required],
    ciudad: ['Prueba', Validators.required],
    localidad: ['Prueba', Validators.required],
    pais: ['Prueba', Validators.required],
    cp: [101010, Validators.required],
    avatar: ['av-chopper.png']
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

  constructor(private adminService: AdministradorService,
    private navCrtl: NavController,
    private interfazUsuario: InterfazUsuarioService,
    private formBuilder: FormBuilder) { }

  ngOnInit() { }

  async signup(formSignup: FormGroup) {
    if(formSignup.invalid) {
      return;
    }

    const valido = await this.adminService.registro(formSignup.value);
    console.log('Valor de VALIDO: ', valido);
      
    if(valido) {
      // Alerta de error
      this.interfazUsuario.alertaLogin('Administrador registrado con éxito.');
    } else {
      this.interfazUsuario.alertaLogin('Ya existe ese administrador.');
    }
  }

  emailAdminNoValido(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const email = control.value;
      if (email && !(email.toLowerCase().endsWith('@admin.com'))) {
        return { 'emailNoPermitido': true };
      }
      return null;
    };
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

}
