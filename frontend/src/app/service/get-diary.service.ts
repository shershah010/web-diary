import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetDiaryService {

    /** Send all requests as JSON */
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  /** Fetches all journal entries. The `toPromise` allows the call to be 
   * completed by the `await` keyword before returning. */
  async getEntries() {
    return await this.http.get('https://web-diary-be.sher.com/entry').toPromise();
  }


  /** Fetches a particular journal entry by its title. */
  async getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return await this.http.get('https://web-diary-be.sher.com/entry/' + filename).toPromise();
  }

  /** Atempts to create the post but first checks if an entry with the same 
   * title exists. If it does, then inform the user to change the title. */
  async writeNewTextFile(entry: any) {
    const response = await this.http.post('https://web-diary-be.sher.com/create', {entry: entry}).toPromise();

    if (response['exists']) {
      alert("Please change the title, it is already taken!");
      return "bad title";
    } else {
      return response;
    }
  }

  /** Updates an existing entry. */
  async writeTextFile(entry: any) {
    return await this.http.post('https://web-diary-be.sher.com/update', entry).toPromise();
  }
}
