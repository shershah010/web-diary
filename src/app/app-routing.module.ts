import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'edit', component: EditComponent},
  { path: 'create', component: CreateComponent},
  { path: 'callback', component: CallbackComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
