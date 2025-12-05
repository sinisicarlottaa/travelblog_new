import { AfterViewInit, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { TravelService } from '../shared/service/travel.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { Filter } from '../shared/models/filter.model';
import { ThemeService } from '../shared/service/theme.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss',
})
export class GraphsComponent implements AfterViewInit {
  private travelService = inject(TravelService);

  yearChart: Chart | null = null;
  countryChart: Chart | null = null;
  @ViewChild('yearChartCanvas') yearChartCanvas!: ElementRef;
  @ViewChild('countryChartCanvas') countryChartCanvas!: ElementRef;

  isDarkMode = false;
  public sub?: Subscription;

  constructor(private themeService: ThemeService, private translateService: TranslateService) {
    this.sub = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      this.updateCharts();
    });
  }

  filterActive = signal<Filter>({ country: '', rating: '', search: '', author: '', year: null });

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
    // neutrali chiari (per superfici + testi secondari)
    '#cbb8a8',
    '#b69e88',
    '#a48b76',

    // caldi / terracotta
    '#d28556',
    '#c06a34',
    '#a85828',
    '#8a4621',

    // marroni + biscotto ben separati
    '#b99572',
    '#9d7b5c',
    '#82654a',

    // arancio / ocra (accenti vivaci)
    '#e7a53a',
    '#c08000',

    // verdi naturali (più luminosi del tuo tentativo precedente)
    '#8bbc78',
    '#6f9d58',
    '#557b40',

    // verdi acqua / turchesi soft
    '#7dbdb0',
    '#5ca097',
    '#417f75',

    // blu polvere / blu profondi
    '#99b3c2',
    '#7c9aab',
    '#607e91',
    '#496273',

    // violetti soft / desaturati
    '#c0aee0',
    '#a287c9',
    '#8a6fb0',
  ];

  async ngAfterViewInit() {
    // viaggi
    const travelsCountry = await firstValueFrom(
      this.travelService.getStatsCountry(this.filterActive())
    );
    const travelsYear = await firstValueFrom(this.travelService.getStatsYears(this.filterActive()));

    // filtra
    // const visitedYear = travelsYear.filter((t) => t.year);
    // const visitedCountry = travelsCountry.filter((t) => t.country);

    // conteggio per anno
    // const countsYear: Record<string, number> = {};
    // travelsYear.forEach((travel) => {
    //   // const year = String(travel.year);
    //   // countsYear[year] = (countsYear[year] ?? 0) + 1;
    // });

    // const countsCountry: Record<string, number> = {};
    // travelsCountry.forEach((travel) => {
    //   // const country = travel.country;
    //   // countsCountry[country] = (countsCountry[country] ?? 0) + 1;
    // });

    // const years = Object.keys(countsYear).sort();
    // const valuesYear = years.map((y) => countsYear[y]);

    // const countries = Object.keys(countsCountry).sort(
    //   (a, b) => countsCountry[b] - countsCountry[a]
    // );
    // const valuesCountry = countries.map((c) => countsCountry[c]);
    const countries = travelsCountry.map((el) => el.u).sort((a, b) => b - a);

    this.yearChart = new Chart(this.yearChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: travelsYear.map((el) => el.t),
        datasets: [
          {
            label: this.translateService.instant('GRAPHS.NUMBER_TRAVELS'),
            data: travelsYear.map((el) => el.u),
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
        labels: travelsCountry.map((el) => el.t),
        datasets: [
          {
            label: this.translateService.instant('GRAPHS.VISITED_COUNTRIES'),
            data: countries,
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
              color: '#b97f5aff',
            },
          },
        },
      },
    });
  }

  private updateCharts() {
    if (!this.yearChart || !this.countryChart) {
      return;
    }
    const colors = this.isDarkMode ? this.darkPalette : this.palette;

    this.yearChart.data.datasets[0].backgroundColor = colors;
    this.yearChart.update();

    this.countryChart.data.datasets[0].backgroundColor = colors;
    this.countryChart.update();
  }
}
