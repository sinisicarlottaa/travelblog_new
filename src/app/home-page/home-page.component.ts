import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TravelService } from '../shared/travel.service';
import { Travel } from '../shared/travel.model';
import { firstValueFrom } from 'rxjs';
import { GraphsComponent } from "../graphs/graphs.component";

@Component({
  selector: 'app-home',
  imports: [CardComponent, GraphsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomeComponent implements OnInit {
  private travelService = inject(TravelService);

  ngOnInit(): void {
    this.getTravels();
  }

  travels = signal<Travel[]>([]);
  travelsFiltered = computed(() => this.travels().slice(this.start(), this.start() + 5));
  start = signal(0);

  loading = signal(false);

  public async getTravels() {
    try {
      this.loading.set(true);
      const travels = await firstValueFrom(this.travelService.getTravels());
      this.travels.set(travels);
      console.log(travels);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }

  // onTravelClicked(event: Travel) {
  //   console.log('ciao');
  // }
}
