import { AfterViewInit, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { TravelService } from '../shared/service/travel.service';
import { firstValueFrom } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { Filter } from '../shared/models/filter.model';

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss',
})
export class GraphsComponent implements AfterViewInit {
  private travelService = inject(TravelService);

  @ViewChild('yearChartCanvas') yearChartCanvas!: ElementRef;
  @ViewChild('countryChartCanvas') countryChartCanvas!: ElementRef;

   filterActive = signal<Filter>({ country : '' , rating : '' , search : '' , user : '', year : null});

  async ngAfterViewInit() {
    // viaggi
    const travels = await firstValueFrom(this.travelService.getTravels(this.filterActive()));

    // filtra
    const visitedYear = travels.filter((t) => t.type === 'Y' && t.year);
    const visitedCountry = travels.filter((t) => t.country);

    // conteggio per anno
    const countsYear: Record<string, number> = {};
    visitedYear.forEach((travel) => {
      const year = String(travel.year);
      countsYear[year] = (countsYear[year] ?? 0) + 1;
    });

    const countsCountry: Record<string, number> = {};
    visitedCountry.forEach((travel) => {
      const country = travel.country;
      countsCountry[country] = (countsCountry[country] ?? 0) + 1;
    });

    const years = Object.keys(countsYear).sort();
    const valuesYear = years.map((y) => countsYear[y]);

    const countries = Object.keys(countsCountry).sort(
      (a, b) => countsCountry[b] - countsCountry[a]
    );
    const valuesCountry = countries.map((c) => countsCountry[c]);

    const palette = [
      // neutri chiari
      '#f2dfd3',
      '#e7c8a0',
      '#d9bfa5',

      // caldi / terracotta
      '#d49867',
      '#c77742',
      '#b55f2c',
      '#9d4f28',

      // marroni + biscotto ben separati
      '#c5a27a',
      '#a88462',
      '#8d6d4f',

      // arancio / ocra
      '#e49b2b',
      '#b67300',

      // verdi naturali (tono neutro)
      '#7ea86d',
      '#5c8e4a',
      '#3f7033',

      // verdi acqua / turchesi soft
      '#6aaea1',
      '#4c9489',
      '#317a6f',

      // blu polvere / blu profondi
      '#8fa7b3',
      '#6f91a1',
      '#4f7487',
      '#355a6e',

      // violetti soft / desaturati
      '#b3a0c6',
      '#947eb3',
      '#7b6499',
    ];

    new Chart(this.yearChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Numero di viaggi',
            data: valuesYear,
            backgroundColor: palette,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    new Chart(this.countryChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Paesi visitati',
            data: valuesCountry,
            backgroundColor: palette,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right', // invece di 'top'
            align: 'center', // o 'start'
            labels: {
              boxWidth: 14,
              boxHeight: 10,
              padding: 15,
            },
          },
        },
      },
    });
  }
}
