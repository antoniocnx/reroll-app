import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-actualiza-perfil',
  templateUrl: './actualiza-perfil.page.html',
  styleUrls: ['./actualiza-perfil.page.scss'],
})
export class ActualizaPerfilPage implements OnInit {

  usuario: Usuario = {};

  formUpdate: FormGroup = this.formBuilder.group ({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, this.emailAdminNoValido()]],
    password: ['', [Validators.minLength(6)]],
    nacimiento: ['', Validators.required],
    sexo: ['', Validators.required],
    direccion: ['', Validators.required],
    ciudad: ['', Validators.required],
    localidad: ['', Validators.required],
    pais: ['', Validators.required],
    cp: ['', Validators.required],
    avatar: ['']
  })

  // formUpdate: FormGroup = this.formBuilder.group ({
  //   nombre: [this.usuario.nombre],
  //   apellidos: [this.usuario.apellidos],
  //   email: [ this.usuario.email, Validators.email, this.emailAdminNoValido() ] , //
  //   password: [ this.usuario.password, Validators.minLength(6) ],
  //   nacimiento: [this.usuario.nacimiento],
  //   sexo: [this.usuario.sexo],
  //   direccion: [this.usuario.direccion],
  //   ciudad: [this.usuario.ciudad],
  //   localidad: [this.usuario.localidad],
  //   pais: [this.usuario.pais],
  //   cp: [this.usuario.cp],
  //   avatar: [this.usuario.avatar]
  // })

  isTypePassword: boolean = true;
  isLoading: boolean = false;

  constructor(private usuarioService: UsuarioService,
              private interfazUsuario: InterfazUsuarioService,
              private navCrtl: NavController,
              private formBuilder: FormBuilder, 
              private alertController: AlertController) { }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.formUpdate.patchValue(this.usuario);
  }

  valorForm(form: FormGroup) {
    console.log(form.value)
  }
  
  async actualizar(formUpdate: FormGroup) {

    const alert = await this.alertController.create({
      header: 'Editar perfil',
      message: '¿Está seguro de que desea guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, 
        {
          text: 'Confirmar',
          handler: async () => {
            const actualizado = await this.usuarioService.actualizarUsuario(formUpdate.value);

            if(actualizado) {
              // Toast con el mensaje
              this.interfazUsuario.presentToast('Usuario actualizado correctamente');
              this.navCrtl.navigateRoot('/user/perfil', {animated: true});
            } else {
              // Toast con el error
              this.interfazUsuario.presentToast('Error al actualizar el usuario');
            }
          }
        }
      ]
    });
  
    await alert.present();

  }

  async alertaCancelar() {
    const alert = await this.alertController.create({
      header: 'Editar perfil',
      message: '¿Está seguro de que desea salir sin guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, 
        {
          text: 'Confirmar',
          handler: () => {
            this.formUpdate.reset();
            this.navCrtl.navigateRoot('/user/perfil', {animated: true});
          }
        }
      ]
    });
  
    await alert.present();
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
