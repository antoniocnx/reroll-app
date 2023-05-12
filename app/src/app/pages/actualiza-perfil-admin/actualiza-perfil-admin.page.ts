import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavController, AlertController, IonInput } from '@ionic/angular';
import { Administrador } from 'src/app/interfaces/interfaces';
import { AdministradorService } from 'src/app/services/administrador.service';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';

declare const google: any;

@Component({
  selector: 'app-actualiza-perfil-admin',
  templateUrl: './actualiza-perfil-admin.page.html',
  styleUrls: ['./actualiza-perfil-admin.page.scss'],
})
export class ActualizaPerfilAdminPage implements OnInit {

  // Google Maps

  @ViewChild('autocompleteAddres') autocompleteAddres!: IonInput;
  @ViewChild('autocompleteCity') autocompleteCity!: IonInput;
  @ViewChild('autocompleteTown') autocompleteTown!: IonInput;
  @ViewChild('autocompleteCountry') autocompleteCountry!: IonInput;
  @ViewChild('autocompletePostal') autocompletePostal!: IonInput;

  //

  admin: Administrador = {};

  formUpdate: FormGroup = this.formBuilder.group({
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

  ionViewDidEnter() {
    // Calle
    this.autocompleteAddres.getInputElement().then((res: any) => {
      const auto = new google.maps.places.Autocomplete(res);
      auto.addListener('place_changed', () => {
        const place = auto.getPlace();
        console.log(place);
        if (place && place.address_components) {
          // Actualizar campo de localidad
          const townComponent = place.address_components.find((c: { types: string | string[]; }) => c.types.includes('locality'));
          if (townComponent) {
            this.autocompleteTown.value = townComponent.long_name;
          } else {
            this.autocompleteTown.value = '';
          }

          // Actualizar campo de ciudad
          const cityComponent = place.address_components.find((c: { types: string | string[]; }) => c.types.includes('administrative_area_level_2'));
          if (cityComponent) {
            this.autocompleteCity.value = cityComponent.long_name;
          } else {
            this.autocompleteCity.value = '';
          }

          // Actualizar campo de país
          const countryComponent = place.address_components.find((c: { types: string | string[]; }) => c.types.includes('country'));
          if (countryComponent) {
            this.autocompleteCountry.value = countryComponent.long_name;
          } else {
            this.autocompleteCountry.value = '';
          }

          // Actualizar campo de código postal
          const postalComponent = place.address_components.find((c: { types: string | string[]; }) => c.types.includes('postal_code'));
          if (postalComponent) {
            this.autocompletePostal.value = postalComponent.long_name;
          } else {
            this.autocompletePostal.value = '';
          }

          // Actualizar campo de dirección
          const streetComponent = place.address_components.find((c: { types: string | string[]; }) => c.types.includes('route'));
          const streetNumberComponent = place.address_components.find((c: { types: string[]; }) => c.types.includes('street_number'));
          const postalCodeComponent = place.address_components.find((c: { types: string[]; }) => c.types.includes('postal_code'));

          let streetName = '';
          if (streetComponent) {
            streetName += streetComponent.long_name;
          }
          if (streetNumberComponent) {
            const streetNumber = streetNumberComponent.long_name;
            this.autocompleteAddres.value = `${streetName} ${streetNumber}`;
          } else {
            const formattedAddress = place.formatted_address;
            const regex = new RegExp(`${this.autocompleteCity.value}|${this.autocompleteCountry.value}|,\\s*$|\\s*,\\s*`, 'gi');
            let modifiedFormattedAddress = formattedAddress.replace(regex, '').trim();
            if (postalCodeComponent) {
              const postalCode = postalCodeComponent.long_name;
              modifiedFormattedAddress = modifiedFormattedAddress.replace(postalCode, '').trim();
            }
            const modifiedStreetName = modifiedFormattedAddress.replace(streetName, '').trim();
            this.autocompleteAddres.value = modifiedStreetName;
          }

        }
      });
    });

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

            if (actualizado) {
              // Toast con el mensaje
              this.interfazUsuario.presentToast('Administrador actualizado correctamente');
              this.navCrtl.navigateRoot('/admin/perfil-admin', { animated: true });
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
            this.navCrtl.navigateRoot('/admin/perfil-admin', { animated: true });
          }
        }
      ]
    });

    await alert.present();
  }

  emailAdminNoValido(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
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
