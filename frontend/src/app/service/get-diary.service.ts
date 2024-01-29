import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendMsg } from '../model/response';
import { Entry } from '../model/entry';

@Injectable({
  providedIn: 'root'
})
export class GetDiaryService {

    /** Send all requests as JSON */
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  /** Fetches all journal entries. The `toPromise` allows the call to be 
   * completed by the `await` keyword before returning. */
  async getEntries() {
    const response = await this.http.get<BackendMsg>('https://web-diary-be.sher.com/entry', this.httpOptions).toPromise();
    return response;
  }


  /** Fetches a particular journal entry by its title. */
  async getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    const safeFilename = encodeURIComponent(filename);
    const response =  await this.http.get<BackendMsg>('https://web-diary-be.sher.com/entry/' + safeFilename, this.httpOptions).toPromise();
    return response;
  }

  /** Atempts to create the post but first checks if an entry with the same 
   * title exists. If it does, then inform the user to change the title. */
  async writeNewTextFile(entry: Entry) {
    const response = await this.http.post<BackendMsg>('https://web-diary-be.sher.com/create', entry, this.httpOptions).toPromise();

    if (response.success == 'false') {
      alert("Please change the title, it is already taken!");
      return {message: "bad title"};
    } else {
      return response;
    }
  }

  /** Updates an existing entry. */
  async writeTextFile(entry: Entry) {
    const response = await this.http.post<BackendMsg>('https://web-diary-be.sher.com/update', entry, this.httpOptions).toPromise();
    return response;
  }
}
