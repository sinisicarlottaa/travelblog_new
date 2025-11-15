import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { Travel } from '../shared/models/travel.model';
import { TravelService } from '../shared/service/travel.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FiltersComponent } from '../filters/filters.component';
import { AllTravelsComponent } from '../visited-travels/visited-travels.component';
import { Filter } from '../shared/models/filter.model';

@Component({
  selector: 'app-visited-mytravels-page',
  imports: [AllTravelsComponent, FormsModule, FiltersComponent],
  templateUrl: './visited-mytravels-page.component.html',
  styleUrl: './visited-mytravels-page.component.scss',
})
export class VisitedMyTravelsPageComponent {
  private travelService = inject(TravelService);

  travels = signal<Travel[]>([]);
  loading = signal(false);

  filterActive = signal<Filter>({ country: '', rating: '', search: '', user: '', year: null });
  isFiltersActive = computed(
    () =>
      !!this.filterActive().country &&
      !!this.filterActive().rating &&
      !!this.filterActive().year &&
      !!this.filterActive().user &&
      !!this.filterActive().search
  );

  ngOnInit(): void {
    this.loadTravels();
  }

  reload(val: Filter) {
    this.filterActive.set(val);
    this.loadTravels(val);
  }

  public async loadTravels(val?: Filter) {
    try {
      this.loading.set(true);
      const travels = await firstValueFrom(this.travelService.getTravels(this.filterActive()));
      this.travels.set(travels);
      console.log('Travels:', travels);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }
}
