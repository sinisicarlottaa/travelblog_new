import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/models/travel.model';
import { firstValueFrom } from 'rxjs';
import { Filter } from '../shared/models/filter.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [CardComponent, TranslatePipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomeComponent implements OnInit {
  private travelService = inject(TravelService);

  constructor(private translateService: TranslateService) {}

  filterActive = signal<Filter>({ country: '', rating: '', search: '', user: '', year: null });

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
      const travel2 = travels.filter((t) => t.type === 'Y')
      this.travels.set(travel2);
      console.log(travels);
    } catch (e) {
      console.log('errore');
      // Inserire errore nel caricamento dei viaggi ERROR_LOADING_TRAVELS
    } finally {
      this.loading.set(false);
    }
  }
}
