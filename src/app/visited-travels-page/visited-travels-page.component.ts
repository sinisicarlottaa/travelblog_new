import { Component, inject, NgModule, OnInit, signal } from '@angular/core';
import { AllTravelsComponent } from '../visited-travels/visited-travels.component';
import { TravelService } from '../shared/travel.service';
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
  

  public async loadTravels() {
    try {
      this.loading.set(true);
      const travels = await firstValueFrom(this.travelService.getTravels());
      const visitedTravels = travels.filter((t) => t.type === 'Y').slice(this.counter, this.counter + 9);
      this.travels.set(visitedTravels);
      console.log('travels<<<<<<<<<<<<<<<<',travels);

    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }

  private currentSearchText: string = '';

  updateSearchText(text: string): void {
    this.currentSearchText = text;
    console.log('Nuova ricerca:', this.currentSearchText);
  }

  filteredTravels(): Travel[] {
    console.log("...filter....");
    const country = this.selectedCountry();
    const year = this.selectedYear();
    const rating = this.selectedRaiting();

    const searchText = this.currentSearchText.toLowerCase().trim();

    return this.travels()
      .filter((travel) => {
        const okCountry = !country || travel.country === country;
        const okYear = !year || String(travel.year) === year;
        const okRating = !rating || travel.rating >= Number(rating);

        const okSearch =
          !searchText ||
          travel.city.toLowerCase().includes(searchText) ||
          travel.country.toLowerCase().includes(searchText) ||
          travel.description.toLowerCase().includes(searchText);

        return okCountry && okYear && okRating && okSearch;
      })

      .sort((a, b) => b.year - a.year);
  }
  
// COUNTER
counter = 0;

increaseCounter() {
    const total = this.filteredTravels().length;
    if (this.counter + 9 < total) {
      this.counter += 9;
    } else {
      this.counter = 0;
    }
  }
}
