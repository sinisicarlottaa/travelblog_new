import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Travel } from './travel.model';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private http = inject(HttpClient);
  private baseUrl: string = "https://chiropodial-myron-nonphysical.ngrok-free.dev/api/travel/";

  // POST
  public getTravels(): Observable<Travel[]> {
    return this.http.post<Travel[]>(`${this.baseUrl}all/filters`, {});
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
