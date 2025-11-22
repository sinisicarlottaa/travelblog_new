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
import { TravelService } from '../shared/service/travel.service';
import { Travel } from '../shared/models/travel.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-searchbar',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  search = new FormControl('');
  onSearch = output<string>();

  constructor() {
    this.search.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((val: string | null) => {
        this.onSearch.emit(val!);
      });
  }
}
