/** This module defines the root compnent which is the loaded into the 
 * `index.html` file. All components are inhereted by this component. Code that 
 * should be run on every page should be added here. */


import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
   constructor() {}
}
