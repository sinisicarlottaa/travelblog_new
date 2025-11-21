import { Component, computed, EventEmitter, inject, input, output, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Travel } from '../shared/models/travel.model';
import { TravelService } from '../shared/service/travel.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  travel = input<Travel>();
  travelOnClick = output<Travel>();
}
