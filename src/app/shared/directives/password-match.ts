import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPasswordMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordMatch,
      multi: true
    }
  ]
})
export class PasswordMatch {
  matchPassword = input<string>('');


   validate(control: AbstractControl): ValidationErrors | null {
    // Se la conferma della password non è uguale alla password principale
    if (control.value !== this.matchPassword) {
      return { passwordMismatch: true };  // Restituisce un errore se non corrispondono
    }
    return null;  // Restituisce null se sono uguali
  }

}
