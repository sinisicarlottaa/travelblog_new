import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  showToastSuccess(successText : string = '') {
     Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      icon: 'success',
      title: 'Successo', 
      text: successText
    });
  }

  showToastError(errorMessage: string = '') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      icon: 'error',
      title: 'Errore',
      text: errorMessage
    });
  }

  dialogDeleteElement() {
   return Swal.fire({
      title: 'Sei sicuro?',
      text: 'Il viaggio verrà eliminato definitivamente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sì, elimina',
      cancelButtonText: 'Annulla',
    });
  }
  }
