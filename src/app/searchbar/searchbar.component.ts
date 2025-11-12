import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Output,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { TravelService } from '../shared/travel.service';
import { Travel } from '../shared/travel.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  private travelService = inject(TravelService);

  @Output() onSearch = new EventEmitter<string>();

  onInputChange(searchText: string) { 
    this.onSearch.emit(searchText);
  }
}
