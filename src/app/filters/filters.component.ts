import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin } from 'rxjs';
import { TravelService } from '../shared/service/travel.service';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterService } from '../shared/service/filter.service';
import { Filter } from '../shared/models/filter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  private travelService = inject(TravelService);
  filterService = inject(FilterService);
  onFilter = output<Filter>();

  ngOnInit(): void {
    this.initAll();
  }

  formFilter = new FormGroup({
    search: new FormControl(''),
    country: new FormControl(''),
    year: new FormControl(null),
    rating: new FormControl(''),
    user: new FormControl(''),
  });

  constructor(public router: Router) {
    this.formFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((val) => {
        const filter = { ...val, year: val.year ? +val.year! : null };
        this.onFilter.emit(filter as Filter);
      });
  }

  countries = signal<string[]>([]);
  years = signal<number[]>([]);
  users = signal<string[]>([]);
  loading = signal(false);

  async initAll() {
    try {
      this.loading.set(true);
      forkJoin([this.loadCountry(), this.loadYears(), this.loadUser()]);
    } catch (e) {
      console.log('errore');
    } finally {
      this.loading.set(false);
    }
  }

  public async loadCountry() {
    const countries = await firstValueFrom(this.filterService.getCountry());
    this.countries.set(countries);
  }

  public async loadYears() {
    const years = await firstValueFrom(this.filterService.getYears());
    this.years.set(years);
  }

  public async loadUser() {
    const users = await firstValueFrom(this.filterService.getUsers());
    this.users.set(users);
  }
  // public async loadRating() {
  //   const ratings = await firstValueFrom(this.filterService.getUsers());
  //   this.ratings.set(ratings);
  // }
}
