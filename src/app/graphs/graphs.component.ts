import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { TravelService } from '../shared/travel.service';
import { firstValueFrom } from 'rxjs';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [],
  templateUrl: './graphs.component.html',
  styleUrl: './graphs.component.scss',
})
export class GraphsComponent implements AfterViewInit {
  private travelService = inject(TravelService);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  async ngAfterViewInit() {
    // viaggi
    const travels = await firstValueFrom(this.travelService.getTravels());

    // filtra
    const visited = travels.filter((t) => t.type === 'Y' && t.year);

    // quanti per anno
    const counts: Record<string, number> = {};
    visited.forEach((travel) => {
      const year = String(travel.year);
      counts[year] = (counts[year] ?? 0) + 1;
    });

    const years = Object.keys(counts).sort();
    const values = years.map((y) => counts[y]);

    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Numero di viaggi',
            data: values,
            backgroundColor: '#d49867',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
