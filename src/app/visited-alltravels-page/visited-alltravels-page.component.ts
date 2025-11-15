import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AllTravelsComponent } from '../visited-travels/visited-travels.component';
import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/models/travel.model';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FiltersComponent } from '../filters/filters.component';
import { Filter } from '../shared/models/filter.model';

@Component({
  selector: 'app-visited-travels-page',
  imports: [AllTravelsComponent, FormsModule, FiltersComponent],
  templateUrl: './visited-alltravels-page.component.html',
  styleUrl: './visited-alltravels-page.component.scss',
})
export class VisitedAllTravelsPageComponent implements OnInit {
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

  // travelResource = rxResource({
  //   params : () =>  this.filterActive(),
  //   stream : ({params}) => this.travelService.getTravels(params)
  // });

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
