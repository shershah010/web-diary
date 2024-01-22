import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { GetDiaryService } from '../service/get-diary.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  /** The title of the entry, read only. */
  title: string;

  /** Method to display information to the user. */
  status: string;

  /** Writable parts of the entry. */
  diaryForm = new UntypedFormGroup({
   date: new UntypedFormControl(''),
   startTime: new UntypedFormControl(''),
   endTime: new UntypedFormControl(''),
   goodMood: new UntypedFormControl(false),
   content: new UntypedFormControl(''),
  });

  constructor(private getDiaryService: GetDiaryService, 
              private activatedRoute: ActivatedRoute)  { }
  

  /** Gets the entry title from the url. Updates the entry form with the data 
   * from the entry itself. */
  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
        this.title = params['fname'];
    });

    const response = await this.getDiaryService.getTextFile(this.title)
    const file = response['data'];
    this.diaryForm.get('date').setValue(file.date);
    this.diaryForm.get('startTime').setValue(file.startTime);
    this.diaryForm.get('content').setValue(file.content);
    this.diaryForm.get('endTime').setValue(file.endTime);
    this.diaryForm.get('goodMood').setValue(file.goodMood);
  }

  /** Handles submitting the form and sends to the backend. Displays the message
   *  returned by the backend. */
  async onSubmit() {
    const values = Object.assign(this.diaryForm.value); // Converts the form group to a dictionary.
    values["title"] = this.title;
    const response = await this.getDiaryService.writeTextFile(values);
    this.status = response["message"];
  }
}
