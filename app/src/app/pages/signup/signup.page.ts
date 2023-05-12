import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IonInput, NavController } from '@ionic/angular';

import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  // Google Maps

  @ViewChild('autocompleteAddres') autocompleteAddres!: IonInput;
  @ViewChild('autocompleteCity') autocompleteCity!: IonInput;
  @ViewChild('autocompleteTown') autocompleteTown!: IonInput;
  @ViewChild('autocompleteCountry') autocompleteCountry!: IonInput;
  @ViewChild('autocompletePostal') autocompletePostal!: IonInput;

  //

  formSignup: FormGroup = this.formBuilder.group({
    nombre: ['Test 2', Validators.required],
    apellidos: ['Test', Validators.required],
    email: ['test2@test.com', [Validators.required, Validators.email, this.emailAdminNoValido()]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    nacimiento: [(new Date('2000-01-01')), Validators.required],
    sexo: ['Mujer', Validators.required],
    direccion: ['', Validators.required],
    ciudad: ['', Validators.required],
    localidad: ['', Validators.required],
    pais: ['', Validators.required],
    cp: [Validators.required],
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
    private formBuilder: FormBuilder,
    private zone: NgZone) { }

  ngOnInit() { }


  // Autocompletado de la dirección

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
          let streetName = '';
          if (streetComponent) {
            streetName += streetComponent.long_name;
          }
          if (streetNumberComponent) {
            const streetNumber = streetNumberComponent.long_name;
            this.autocompleteAddres.value = `${streetName} ${streetNumber}`;
          } else {
            const formattedAddress = place.formatted_address;
            // const regex = new RegExp(`${this.autocompleteCity.value}|${this.autocompleteCountry.value}|^,\\s*|\\s*,\\s*$`, 'gi');
            const regex = new RegExp(`${this.autocompleteCity.value}|${this.autocompleteCountry.value}|,\\s*$|\\s*,\\s*`, 'gi');
            const modifiedFormattedAddress = formattedAddress.replace(regex, '').trim();
            const modifiedStreetName = modifiedFormattedAddress.replace(streetName, '').trim();
            this.autocompleteAddres.value = modifiedStreetName;
          }


        }
      });
    });

  }


  // Registro con login automático
  async signup(formSignup: FormGroup) {
    if (formSignup.invalid) {
      return;
    }

    const valido = await this.usuarioService.registro(formSignup.value);

    if (!valido) {
      // Ir a tabs
      const ok = await this.usuarioService.login(this.formSignup.value.email, this.formSignup.value.password);

      if (ok) {
        // Ir a tabs
        this.navCrtl.navigateRoot('/user/inicio', { animated: true });
      }

    } else {
      // Alerta de error
      this.interfazUsuario.alertaLogin('Ya existe ese usuario.');
    }
  }

  emailAdminNoValido(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
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
