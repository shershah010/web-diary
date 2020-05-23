import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GetDiaryService } from '../service/get-diary.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  title: string;
  status: string;
  diaryForm = new FormGroup({
   date: new FormControl(''),
   startTime: new FormControl(''),
   endTime: new FormControl(''),
   goodMood: new FormControl(false),
   content: new FormControl(''),
  });

  constructor(private getDiaryService: GetDiaryService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
        this.title = params['fname'];
    });
  }

  ngOnInit() {
    this.getDiaryService.getTextFile(this.title).then(response => {
      let file = response['data'];
      this.diaryForm.get('date').setValue(file.date);
      this.diaryForm.get('startTime').setValue(file.startTime);
      this.diaryForm.get('content').setValue(file.content);
      this.diaryForm.get('endTime').setValue(file.endTime);
      this.diaryForm.get('goodMood').setValue(file.goodMood);
    });
  }

  onSubmit() {
    let values = Object.assign(this.diaryForm.value);
    values["title"] = this.title;
    this.getDiaryService.writeTextFile(JSON.stringify(values)).then((reponse) => {
      this.status = reponse["message"];
    });
  }
}
