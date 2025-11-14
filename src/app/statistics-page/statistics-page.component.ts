import { Component, signal } from '@angular/core';
import { GraphsComponent } from '../graphs/graphs.component';

@Component({
  selector: 'app-statistics-page',
  imports: [GraphsComponent],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
})
export class StatisticsPageComponent {

}
