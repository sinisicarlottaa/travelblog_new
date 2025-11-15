import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/models/travel.model';
import { firstValueFrom } from 'rxjs';
import { GraphsComponent } from "../graphs/graphs.component";
import { Filter } from '../shared/models/filter.model';

@Component({
  selector: 'app-home',
  imports: [CardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomeComponent implements OnInit {
  private travelService = inject(TravelService);

   filterActive = signal<Filter>({ country : '' , rating : '' , search : '' , user : '', year : null});

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
      const travels = await firstValueFrom(this.travelService.getTravels(this.filterActive()));
      this.travels.set(travels);
      console.log(travels);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }
}
