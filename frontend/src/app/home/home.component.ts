import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Entry } from '../model/entry';
import { GetDiaryService } from '../service/get-diary.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /** List of diary entries sorted by date in descending order. */
  entries: Array<Entry> = [];

  /** When true, users can see the individual entries with their titles, 
   * content, etc. When false, entries are small boxes to show the mood over 
   * time. */
  zoomedIn: boolean = true;

  /** Initalizing services necessary for the component. */
  constructor(
    private getDiaryService: GetDiaryService, 
    public auth: AuthService) {
    
  }

  /**
   * Handle component initialization. Fetches all the diary entries from the 
   * backend, creates Entry objects from them, and orders the entries based on 
   * the orders them by date.
   */
 async ngOnInit() { 
    const response = await this.getDiaryService.getEntries();
    console.log(response);
    response["data"].forEach(element => {
      this.entries.push(new Entry(element));
    });

    this.entries.sort((a: Entry, b: Entry) => {
      let aIsBigger = (new Date(a.date)) > (new Date(b.date));
      if (aIsBigger) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  /**
   * Logs in the user by redirecting to Auth0 for authentication
   */
  loginWithRedirect(): void {
    // Call this to redirect the user to the login page
    this.auth.loginWithRedirect();
  }

  /**
   * Logs the user out of the applicaion, as well as on Auth0 and redirects the 
   * user to the homepage.
   */
  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  /** Alternates the view from seeing each entry with a preview of the content 
   * and a birds eye view where each entry is a small block to show the 
   * semantics of many entries as the same time. This toggles a css class which 
   * created an animation between the zoomed out and zoomed in view. */
  zoom() {
    this.zoomedIn = !this.zoomedIn;
  }

}
