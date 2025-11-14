import { Component, computed, EventEmitter, inject, input, output, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Travel } from '../shared/travel.model';
import { TravelService } from '../shared/service/travel.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  // private travelService = inject(TravelService);

  travel = input<Travel>();
  travelOnClick = output<Travel>();
}
