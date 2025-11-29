import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TravelService } from '../shared/service/travel.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { UserComponent } from '../user/user.component';
import { User } from '../shared/models/auth.model';

@Component({
  selector: 'app-users-page',
  imports: [TranslatePipe, UserComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private authService = inject(AuthService);

  loading = signal(false);
  users = signal<User[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  public async loadUsers() {
    try {
      this.loading.set(true);
      const users = await firstValueFrom(this.authService.getUserAdministration());
      console.log('111', users);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }
}
