import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from '../model/entry';

@Pipe({ name: 'titleFilter' })

export class FilterPipe implements PipeTransform {

  /** Filters Entries based on if their title contains the search text. Enables 
   * searching though the entries. */
  transform(items: Entry[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.title.toLowerCase().includes(searchText);
    });
   }

}
