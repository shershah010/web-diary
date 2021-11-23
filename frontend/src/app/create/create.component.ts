import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GetDiaryService } from '../service/get-diary.service';

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
    const datetime = new Date();
    this.date = datetime.toLocaleDateString();
    this.startTime = datetime.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'});
  }

  onSubmit() {
    this.endTime = (new Date()).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'});
    let values = Object.assign(this.diaryForm.value);
    values['date'] = this.date;
    values['startTime'] = this.startTime;
    values['endTime'] = this.endTime;
    this.getDiaryService.writeNewTextFile(JSON.stringify(values)).then(response => {
      this.status = response['message'];
    });
  }

}
