import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Pipe, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private http = inject(HttpClient);
  private baseUrlFilters: string = 'https://gentlewomanly-eun-ruminantly.ngrok-free.dev/api/';

  selectedRaiting = signal<string>('');
  selectedYear = signal<string>('');
  selectedCountry = signal<string>('');
  selectedSearch = signal<string>('');
  selectedAuthor = signal<string>('');

  // POST country
  public getCountry(): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrlFilters}country/all`, {});
  }

  public getYears(): Observable<number[]> {
    return this.http.post<number[]>(`${this.baseUrlFilters}years/all`, {});
  }

  public getAuthors(): Observable<string[]> {
    return this.http.post<string[]>(`${this.baseUrlFilters}user/all`, {});
  }
}
