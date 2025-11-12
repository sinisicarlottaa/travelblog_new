import { Pipe, PipeTransform } from '@angular/core';
import { Travel } from './travel.model';

@Pipe({
  name: 'filter',
})
export class FilterPipe {
  transform(travel: Travel[], searchText: string): any[] {
    if (!travel) return [];
    if (!searchText) return travel;
    searchText = searchText.toLowerCase();
    return travel.filter((travel) => {
      return (
        travel.city.toLowerCase().includes(searchText) ||
        travel.country.toLowerCase().includes(searchText) ||
        travel.description.toLowerCase().includes(searchText)
      );
    });
  }
}
