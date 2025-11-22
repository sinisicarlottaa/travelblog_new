import { Component, signal } from '@angular/core';
import { GraphsComponent } from '../graphs/graphs.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-statistics-page',
  imports: [GraphsComponent, TranslatePipe],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss',
})
export class StatisticsPageComponent {}
