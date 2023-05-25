import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IonInput, LoadingController, NavController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

declare const google: any;
const mapsKey = environment.googleMapsKey;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  // Google Maps

  @ViewChild('autocompleteAddress') autocompleteAddress!: IonInput;
  @ViewChild('autocompleteCity') autocompleteCity!: IonInput;
  @ViewChild('autocompleteTown') autocompleteTown!: IonInput;
  @ViewChild('autocompleteCountry') autocompleteCountry!: IonInput;
  @ViewChild('autocompletePostal') autocompletePostal!: IonInput;

  //

  formSignup: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, this.noScriptValidator]],
    apellidos: ['', [Validators.required, this.noScriptValidator]],
    email: ['', [Validators.required, Validators.email, this.emailAdminNoValido(), this.noScriptValidator]],
    password: ['', [Validators.required, Validators.minLength(6), this.noScriptValidator]],
    nacimiento: [(new Date('2000-01-01')), [Validators.required, this.mayorDeEdad, this.noScriptValidator]],
    sexo: ['', Validators.required],
    direccion: ['', [Validators.required, this.noScriptValidator]],
    ciudad: ['', [Validators.required, this.noScriptValidator]],
    localidad: ['', [Validators.required, this.noScriptValidator]],
    pais: ['', [Validators.required, this.noScriptValidator]],
    cp: [[Validators.required, this.noScriptValidator]],
    avatar: ['av-robin.png'],
    checkbox: [false, [Validators.requiredTrue, this.noScriptValidator]]
  })

  isTypePassword: boolean = true;

  cargandoGeoloc = false;

  constructor(private usuarioService: UsuarioService,
    private navCrtl: NavController,
    private interfazUsuario: InterfazUsuarioService,
    private formBuilder: FormBuilder) { }

  ngOnInit() { }

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

  // Autocompletado de la dirección

  ionViewDidEnter() {
    // Calle
    this.autocompleteAddress.getInputElement().then((res: any) => {
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
            this.autocompleteAddress.value = `${streetName} ${streetNumber}`;
          } else {
            const formattedAddress = place.formatted_address;
            const regex = new RegExp(`${this.autocompleteCity.value}|${this.autocompleteCountry.value}|,\\s*$|\\s*,\\s*`, 'gi');
            let modifiedFormattedAddress = formattedAddress.replace(regex, '').trim();
            if (postalCodeComponent) {
              const postalCode = postalCodeComponent.long_name;
              modifiedFormattedAddress = modifiedFormattedAddress.replace(postalCode, '').trim();
            }
            const modifiedStreetName = modifiedFormattedAddress.replace(streetName, '').trim();
            this.autocompleteAddress.value = modifiedStreetName;
          }

        }
      });
    });

  }

  async geolocalizar() {
    this.cargandoGeoloc = true;
    try {
      const position = await Geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(latitude, longitude);
      const request = { latLng: latlng };
      geocoder.geocode(request, (results: any, status: any) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.cargandoGeoloc = false;
          if (results[0] != null) {
            const address = results[0].address_components;
            const streetNumber = address.find((component: { types: string | string[]; }) => component.types.includes('street_number'))?.long_name ?? '';
            const streetName = address.find((component: { types: string | string[]; }) => component.types.includes('route'))?.long_name ?? '';
            const city = address.find((component: { types: string | string[]; }) => component.types.includes('locality'))?.long_name ?? '';
            const state = address.find((component: { types: string | string[]; }) => component.types.includes('administrative_area_level_1'))?.long_name ?? '';
            const country = address.find((component: { types: string | string[]; }) => component.types.includes('country'))?.long_name ?? '';
            const postalCode = address.find((component: { types: string | string[]; }) => component.types.includes('postal_code'))?.long_name ?? '';

            this.formSignup.patchValue({
              direccion: `${streetName} ${streetNumber}`,
              ciudad: city,
              localidad: state,
              pais: country,
              cp: postalCode
            });
          } else {
            console.log('No se encontraron resultados');
          }
        } else {
          console.log('La geolocalización falló debido a: ' + status);
        }
      });
    } catch (error) {
      console.log('Error obtienendo la geolocalización', error);
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

  mayorDeEdad(control: AbstractControl): { [key: string]: boolean } | null {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    if (hoy.getMonth() < fechaNacimiento.getMonth() || (hoy.getMonth() == fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      return { 'menorDeEdad': true };
    }

    return null;
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }


}
