import { Component, inject, input, output, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { User } from '../shared/models/auth.model';
import { ToastService } from '../shared/service/toast.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { LowerCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [TranslatePipe, LowerCasePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = input<User>();
  loading = signal(false);

  constructor(private translateService: TranslateService) {}

  async onDelete() {
    const user = this.user();
    if (!user) return;
    // const confirm = await this.toastService.dialogDeleteElement();

    // if (!confirm.isConfirmed) return;

    console.log(user.id);
    this.loading.set(true);

    try {
      await firstValueFrom(this.authService.deleteUserAdministration(user.id));
      // this.toastService.showToastSuccess(
      //   this.translateService.instant('DETAIL_PAGE.SUCCESS_DELETING')
      // );
      this.router.navigate(['/users']);
    } catch (error) {
      console.error('Errore durante l’eliminazione:', error);
      // this.toastService.dialogDeleteElement();
    } finally {
      this.loading.set(false);
    }
  }
}
