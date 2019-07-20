import { Component, OnInit } from '@angular/core';
import { GetDiaryService } from '../service/get-diary.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  entries: Array<Entry> = [];
  loaded: boolean = true;
  title: string;

  isAuthenticated = false;
  profile: any;

  private auth0Client: Auth0Client;

  constructor(private getDiaryService: GetDiaryService, private authService: AuthService) {
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
  async ngOnInit() {
    // Get an instance of the Auth0 client
    this.auth0Client = await this.authService.getAuth0Client();

    // Watch for changes to the isAuthenticated state
    this.authService.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });

    // Watch for changes to the profile data
    this.authService.profile.subscribe(profile => {
      this.profile = profile;
    });
  }

  /**
   * Logs in the user by redirecting to Auth0 for authentication
   */
  async login() {
    await this.auth0Client.loginWithRedirect({});
  }

  /**
   * Logs the user out of the applicaion, as well as on Auth0
   */
  logout() {
    this.auth0Client.logout({
      client_id: this.authService.config.client_id,
      returnTo: window.location.origin
    });
  }

}

class Entry {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  preview: string;

  constructor(entry: any) {
    this.title = entry.title;
    this.date = entry.date;
    this.startTime = entry.startTime;
    this.endTime = entry.endTime;
    this.preview = entry.content.substr(0, 50) + "...";
  }

}
