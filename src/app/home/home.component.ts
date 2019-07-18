import { Component, OnInit } from '@angular/core';
import { GetDiaryService } from '../service/get-diary.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  entries: Array<Entry> = [];
  loaded: boolean = true;
  title: string;

  constructor(private getDiaryService: GetDiaryService) {
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


  ngOnInit() { }

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
