import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { TranslatePipe } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private translateService: TranslateService) {}

  showToastSuccess(successText: string = '') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      icon: 'success',
      title: 'Successo',
      text: successText,
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
      text: errorMessage,
    });
  }

  dialogDeleteElement() {
    return Swal.fire({
      title: this.translateService.instant('DETAIL_PAGE.SURE_DELETING'),
      text: this.translateService.instant('DETAIL_PAGE.DELETING'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: this.translateService.instant('DETAIL_PAGE.DELETE'),
      cancelButtonText: this.translateService.instant('DETAIL_PAGE.CANCEL'),
    });
  }
}
