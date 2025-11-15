import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Travel } from '../shared/models/travel.model';
import { TravelService } from '../shared/service/travel.service';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Filter } from '../shared/models/filter.model';

@Component({
  selector: 'app-next-travels-page',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './next-travels-page.component.html',
  styleUrl: './next-travels-page.component.scss',
})
export class NextTravelsPageComponent {
  private travelService = inject(TravelService);

   filterActive = signal<Filter>({ country : '' , rating : '' , search : '' , user : '', year : null});

  ngOnInit(): void {
    this.loadTravels();
  }

  travels = signal<Travel[]>([]);
  loading = signal(false);

  public async loadTravels() {
    try {
      this.loading.set(true);
      const travels = await firstValueFrom(this.travelService.getTravels(this.filterActive()));
      const nextTravels = travels.filter((t) => t.type === 'N');
      this.travels.set(nextTravels);
      console.log(travels);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }
}
