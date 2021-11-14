import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { CallbackComponent } from './callback/callback.component';

import { GetDiaryService } from './service/get-diary.service';

import { FilterPipe} from './home/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditComponent,
    CreateComponent,
    FilterPipe,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    GetDiaryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
