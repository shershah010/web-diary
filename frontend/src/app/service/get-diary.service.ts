import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetDiaryService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  getEntries() {
    return this.http.get('https://web-diary-be.sher.com/update').toPromise().then(response => {
      return response;
    });
  }

  getTextFile(filename: string) {
  // The Observable returned by get() is of type Observable<string>
  // because a text response was specified.
  // There's no need to pass a <string> type parameter to get().
    return this.http.post('https://web-diary-be.sher.com/get', {file: filename}).toPromise().then(response => {
      return response;
    });
  }

  writeNewTextFile(entry: any) {
    let otherEntry = JSON.parse(entry);
    return this.http.post('https://web-diary-be.sher.com/create', {entry: otherEntry})
      .toPromise()
      .then(response => {
        if (response['exists']) {
          alert("Please change the title, it is already taken!");
          return new Promise(function(resolve, reject) {
            return "bad title";
          });
        } else {
          return response;
        }
      });
  }

  writeTextFile(entry: any) {
    entry = JSON.parse(entry);
    return this.http.post('https://web-diary-be.sher.com/update', entry)
    .toPromise()
    .then(response => {
        return response;
      });
  }
}
