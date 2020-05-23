import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GetDiaryService } from '../service/get-diary.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  status: string;
  startTime: string;
  endTime: string;
  date: string;
  diaryForm = new FormGroup({
   title: new FormControl(''),
   content: new FormControl(''),
  });

  constructor(private getDiaryService: GetDiaryService) { }

  ngOnInit() {
    this.date = moment().format('l');
    this.startTime = moment().format('LT');
  }

  onSubmit() {
    this.endTime = moment().format('LT');
    let values = Object.assign(this.diaryForm.value);
    values['date'] = this.date;
    values['startTime'] = this.startTime;
    values['endTime'] = this.endTime;
    this.getDiaryService.writeNewTextFile(JSON.stringify(values)).then(response => {
      console.log('hi');
      this.status = response['message'];
    });
  }

}
