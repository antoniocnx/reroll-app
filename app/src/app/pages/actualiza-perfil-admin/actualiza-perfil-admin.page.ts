import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { Administrador } from 'src/app/interfaces/interfaces';
import { AdministradorService } from 'src/app/services/administrador.service';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';

@Component({
  selector: 'app-actualiza-perfil-admin',
  templateUrl: './actualiza-perfil-admin.page.html',
  styleUrls: ['./actualiza-perfil-admin.page.scss'],
})
export class ActualizaPerfilAdminPage implements OnInit {

  admin: Administrador = {};

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
    cp: [Validators.required],
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

  constructor(private adminService: AdministradorService,
              private interfazUsuario: InterfazUsuarioService,
              private navCrtl: NavController,
              private formBuilder: FormBuilder, 
              private alertController: AlertController) { }

  ngOnInit() {
    this.admin = this.adminService.getAdmin();
    this.formUpdate.patchValue(this.admin);
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
            const actualizado = await this.adminService.actualizarAdmin(formUpdate.value);

            if(actualizado) {
              // Toast con el mensaje
              this.interfazUsuario.presentToast('Administrador actualizado correctamente');
              this.navCrtl.navigateRoot('/admin/perfil-admin', {animated: true});
            } else {
              // Toast con el error
              this.interfazUsuario.presentToast('Error al actualizar el administrador');
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
            this.navCrtl.navigateRoot('/admin/perfil-admin', {animated: true});
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
