import { Component } from '@angular/core';
import { TranslateParser, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-page',
  imports: [TranslatePipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {

}
