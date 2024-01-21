import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { GetDiaryService } from '../service/get-diary.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  /** Variable holding the message returned by the backend. */
  status: string;

  /** The time when the page loads in the ISO8601 format. */
  startTime: string;

  /** Today's date taken when the page loads. */
  date: string;

  /** The parts of the diary the user can modify. */
  diaryForm = new UntypedFormGroup({
   title: new UntypedFormControl(''),
   content: new UntypedFormControl(''),
  });

  constructor(private getDiaryService: GetDiaryService) { }

  /** Initalize the start time and data when the page loads. */
  ngOnInit() {
    const datetime = new Date();
    this.date = datetime.toLocaleDateString();
    this.startTime = datetime.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'});
  }

  /** Creates a new entry and prints the response from the backend. */
  onSubmit() {
    const endTime = (new Date()).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'});
    const values = Object.assign(this.diaryForm.value);
    values['date'] = this.date;
    values['startTime'] = this.startTime;
    values['endTime'] = endTime;
    const response = this.getDiaryService.writeNewTextFile(values);
    this.status = response['message'];
  }

}
