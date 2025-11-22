import { Component, computed, EventEmitter, inject, input, output, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Travel } from '../shared/models/travel.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  travel = input<Travel>();
  travelOnClick = output<Travel>();
}
