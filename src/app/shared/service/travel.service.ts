import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Travel } from '../models/travel.model';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private http = inject(HttpClient);
  private baseUrl: string = 'https://chiropodial-myron-nonphysical.ngrok-free.dev/api/travel/';
  private baseUrlFilters: string = 'https://chiropodial-myron-nonphysical.ngrok-free.dev/api/';

  // POST viaggi
  public getTravels(val : Filter): Observable<Travel[]> {
    return this.http.post<Travel[]>(`${this.baseUrl}all/filters`, val);
  }

  // POST year
  public getYear(): Observable<Travel[]> {
    return this.http.post<Travel[]>(`${this.baseUrlFilters}years/all`, {});
  }

  // GET PER DETTAGLI BY ID
  public getTravelById(id: string): Observable<Travel> {
    return this.http.post<Travel>(`${this.baseUrl}${id}`, undefined);
  }

  //POST
  submit(travel: Travel) {
    return this.http.post<Travel>(`${this.baseUrl}add`, travel);
  }

  // DELETE
  delete(id: string) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }

  // PUT (UPDATE)
  update(travel: Travel) {
    return this.http.put<Travel>(`${this.baseUrl}update`, travel);
  }
}
