import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { IonInput, NavController } from '@ionic/angular';
import { AdministradorService } from 'src/app/services/administrador.service';
import { InterfazUsuarioService } from 'src/app/services/interfaz-usuario.service';
import { Geolocation } from '@capacitor/geolocation';

declare const google: any;

@Component({
  selector: 'app-signup-admin',
  templateUrl: './signup-admin.page.html',
  styleUrls: ['./signup-admin.page.scss'],
})
export class SignupAdminPage implements OnInit {

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
    email: ['', [Validators.required, this.emailAdminNoValido(), this.noScriptValidator]],
    password: ['', [Validators.required, Validators.minLength(8), this.passwordCompleja(), this.noScriptValidator]],
    nacimiento: ['', [Validators.required, this.edadPermitida, this.noScriptValidator]],
    sexo: ['', [Validators.required, this.noScriptValidator]],
    direccion: ['', [Validators.required, this.noScriptValidator]],
    ciudad: ['', [Validators.required, this.noScriptValidator]],
    localidad: ['', [Validators.required, this.noScriptValidator]],
    pais: ['', [Validators.required, this.noScriptValidator]],
    cp: [[Validators.required, this.noScriptValidator]],
    avatar: ['av-chopper.png'],
    checkbox: [false, [Validators.requiredTrue, this.noScriptValidator]]
  })

  isTypePassword: boolean = true;
  isLoading: boolean = false;

  cargandoGeoloc = false;

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

  // Complejidad de la contraseña
  passwordCompleja() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Verificar si la contraseña contiene al menos una mayúscula, un número y un símbolo
      const tieneMayuscula = /[A-Z]/.test(value);
      const tieneNumero = /[0-9]/.test(value);
      const tieneSimbolo = /[.!@#$%^&*_\-]/.test(value);

      if (!tieneMayuscula || !tieneNumero || !tieneSimbolo) {
        return { passwordCompleja: true };
      }

      return null;
    };
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

  // Asegura que los años tengan 4 cifras
  getMaxDate() {
    const currentDate = new Date();
    const maxYear = currentDate.getFullYear() + 1;
    const maxDate = new Date(maxYear, 0, 1).toISOString().split('T')[0];
    return maxDate;
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

  async signup(formSignup: FormGroup) {
    if (formSignup.invalid) {
      return;
    }

    const valido = await this.adminService.registro(formSignup.value);

    if (valido) {
      // Alerta de error
      this.interfazUsuario.alertaLogin('Administrador registrado con éxito.');
    } else {
      this.interfazUsuario.alertaLogin('Ya existe ese administrador.');
    }
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
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { emailInvalido: true };
    };
  }

  edadPermitida(control: AbstractControl) {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    const edadMinima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    const edadMaxima = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());

    if (fechaNacimiento > edadMinima) {
      return { menorDeEdad: true };
    }

    if (fechaNacimiento < edadMaxima) {
      return { edadMaxima: true };
    }

    return null;
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

}
