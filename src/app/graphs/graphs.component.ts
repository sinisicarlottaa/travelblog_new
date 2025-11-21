import { AfterViewInit, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { TravelService } from '../shared/service/travel.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { Filter } from '../shared/models/filter.model';
import { ThemeService } from '../shared/service/theme.service';

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss',
})
export class GraphsComponent implements AfterViewInit {
  private travelService = inject(TravelService);

  yearChart!: Chart;
  countryChart!: Chart;
  @ViewChild('yearChartCanvas') yearChartCanvas!: ElementRef;
  @ViewChild('countryChartCanvas') countryChartCanvas!: ElementRef;
  
  isDarkMode = false;
  public sub?: Subscription;

  constructor(private themeService: ThemeService) {
    this.sub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      this.updateCharts();
    });
  }

  filterActive = signal<Filter>({ country: '', rating: '', search: '', user: '', year: null });

  palette = [
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

  darkPalette = [
    // neutri chiari -> neutri scuri / toni di grigio caldo scuro
    '#4a4440', // Corrisponde a #f2dfd3 (più scuro, grigio-marrone)
    '#594e43', // Corrisponde a #e7c8a0
    '#534d43', // Corrisponde a #d9bfa5

    // caldi / terracotta -> terracotta scuro / bordeaux
    '#7a4d33', // Corrisponde a #d49867 (marrone-terracotta scuro)
    '#80411a', // Corrisponde a #c77742 (arancio bruciato)
    '#8a371c', // Corrisponde a #b55f2c
    '#73331b', // Corrisponde a #9d4f28

    // marroni + biscotto ben separati -> marroni scuri / seppia
    '#6b543e', // Corrisponde a #c5a27a
    '#5c4836', // Corrisponde a #a88462
    '#4c3d2f', // Corrisponde a #8d6d4f

    // arancio / ocra -> oro scuro / giallo senape bruciato
    '#996417', // Corrisponde a #e49b2b
    '#7a5000', // Corrisponde a #b67300

    // verdi naturali (tono neutro) -> verdi foresta scuri
    '#4d6943', // Corrisponde a #7ea86d
    '#3c5e32', // Corrisponde a #5c8e4a
    '#2a4b23', // Corrisponde a #3f7033

    // verdi acqua / turchesi soft -> turchesi scuri / verde petrolio
    '#3d6761', // Corrisponde a #6aaea1
    '#2f5f58', // Corrisponde a #4c9489
    '#224b45', // Corrisponde a #317a6f

    // blu polvere / blu profondi -> blu ardesia / blu notte scuri
    '#4c5963', // Corrisponde a #8fa7b3
    '#3c4953', // Corrisponde a #6f91a1
    '#2f3c47', // Corrisponde a #4f7487
    '#23313b', // Corrisponde a #355a6e

    // violetti soft / desaturati -> viola prugna scuri
    '#61526e', // Corrisponde a #b3a0c6
    '#52435f', // Corrisponde a #947eb3
    '#443853', // Corrisponde a #7b6499
  ];

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

    this.yearChart = new Chart(this.yearChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Numero di viaggi',
            data: valuesYear,
            backgroundColor: this.isDarkMode ? this.darkPalette : this.palette,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    this.countryChart = new Chart(this.countryChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Paesi visitati',
            data: valuesCountry,
            backgroundColor: this.isDarkMode ? this.darkPalette : this.palette,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
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

  private updateCharts() {
    const colors = this.isDarkMode ? this.darkPalette : this.palette;

    this.yearChart.data.datasets[0].backgroundColor = colors;
    this.yearChart.update();

    this.countryChart.data.datasets[0].backgroundColor = colors;
    this.countryChart.update();
  }
}
