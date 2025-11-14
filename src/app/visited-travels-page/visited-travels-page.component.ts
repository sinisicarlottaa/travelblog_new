import { Component, computed, effect, inject, linkedSignal, NgModule, OnInit, signal } from '@angular/core';
import { AllTravelsComponent } from '../visited-travels/visited-travels.component';
import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/travel.model';
import { firstValueFrom } from 'rxjs';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visited-travels-page',
  imports: [AllTravelsComponent, SearchbarComponent, FormsModule],
  templateUrl: './visited-travels-page.component.html',
  styleUrl: './visited-travels-page.component.scss',
})
export class VisitedTravelsPageComponent implements OnInit {
  private travelService = inject(TravelService);

  ngOnInit(): void {
    this.loadTravels();
  }

  travels = signal<Travel[]>([]);
  loading = signal(false);
  selectedCountry = signal('');
  selectedYear = signal('');
  selectedRaiting = signal('');
  counter = linkedSignal(() => this.resetCount(this.selectedYear(),this.selectedRaiting(),this.selectedCountry(),this.currentSearchText()));
  currentSearchText = signal('');


  filteredTravels = computed(() => {
    const country = this.selectedCountry();
    const year = this.selectedYear();
    const rating = this.selectedRaiting();
    const searchText = this.currentSearchText()?.toLowerCase().trim();

    return this.travels()
      .filter((travel) => {
        const okCountry = !country || travel.country === country;
        const okYear = !year || travel.year === +year;
        const okRating = !rating || travel.rating >= Number(rating);
        const okSearch =
          !searchText ||
          travel.city?.toLowerCase().includes(searchText) ||
          travel.country?.toLowerCase().includes(searchText) ||
          travel.description?.toLowerCase().includes(searchText);

        return okCountry && okYear && okRating && okSearch;
      }).slice(this.counter(), this.counter() + 9)

      .sort((a, b) => b.year - a.year);
  });

  resetCount(year : string , raiting : string , country : string,search : string){
    console.log("reset counter");
   return 0;
  }

  public async loadTravels() {
    try {
      this.loading.set(true);
      const travels = await firstValueFrom(this.travelService.getTravels());
      const visitedTravels = travels.filter((t) => t.type === 'Y');
      this.travels.set(visitedTravels);
      console.log('travels<<<<<<<<<<<<<<<<', travels);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }

  updateSearchText(text: string): void {
    this.currentSearchText.set(text);
    console.log('Nuova ricerca:', this.currentSearchText());
  }

  increaseCounter() {
    const total = this.travels().length;
    if (this.counter() + 9 < total) {
      this.counter.set(this.counter() + 9);
    } else {
      this.counter.set(0);
    }
  }
}
