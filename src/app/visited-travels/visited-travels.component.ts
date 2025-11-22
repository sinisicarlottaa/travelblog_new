import { Component, input } from '@angular/core';
import { Travel } from '../shared/models/travel.model';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-visited-travels',
  imports: [UpperCasePipe, RouterLink, TranslatePipe],
  templateUrl: './visited-travels.component.html',
  styleUrl: './visited-travels.component.scss',
})
export class AllTravelsComponent {
  travel = input<Travel>();
}
