import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Travel } from '../shared/travel.model';
import { TravelService } from '../shared/travel.service';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-next-travels-page',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './next-travels-page.component.html',
  styleUrl: './next-travels-page.component.scss',
})
export class NextTravelsPageComponent {
  private travelService = inject(TravelService);

  ngOnInit(): void {
    this.loadTravels();
  }

  travels = signal<Travel[]>([]);
  loading = signal(false);

  public async loadTravels() {
    try {
      this.loading.set(true);
      const travels = await firstValueFrom(this.travelService.getTravels());
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
