import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '../shared/models/auth.model';

@Component({
  selector: 'app-user',
  imports: [TranslatePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = input<User>();
  // userOnClick = output<User>();
}
