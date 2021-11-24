import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { GetDiaryService } from '../service/get-diary.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  entries: Array<Entry> = [];
  loaded: boolean = true;
  title: string;
  profile: any;
  zoomedIn: boolean = true;

  constructor(
    private getDiaryService: GetDiaryService, 
    public auth: AuthService) {
    this.getDiaryService.getEntries().then(response => {
      let files = response['data'];
      for (let i = 0; i < files.length; i++) {
        this.entries.push(new Entry(files[i]));
      }
      this.entries.sort((a: Entry, b: Entry) => {
        let aIsBigger = (new Date(a.date)) > (new Date(b.date));
        if (aIsBigger) {
          return -1;
        } else {
          return 1;
        }
      });
    });
  }

  /**
   * Handle component initialization
   */
 ngOnInit() {  }

  /**
   * Logs in the user by redirecting to Auth0 for authentication
   */
  loginWithRedirect(): void {
    // Call this to redirect the user tothe login page
    this.auth.loginWithRedirect();
  }

  /**
   * Logs the user out of the applicaion, as well as on Auth0
   */
  logout() {
    this.auth.logout({
      returnTo: window.location.origin
    })
  }

  zoom() {
    this.zoomedIn = !this.zoomedIn;
  }

}

class Entry {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  preview: string;
  color: string;

  constructor(entry: any) {
    this.title = entry.title;
    this.date = entry.date;
    this.startTime = entry.startTime;
    this.endTime = entry.endTime;
    this.preview = entry.content.substr(0, 50) + "...";
    this.color = entry.goodMood ? '#DEF3FD' : '#FDDFDF'
  }

}
