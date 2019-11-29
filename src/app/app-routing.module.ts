import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './service/auth.guard';

import { HomeComponent } from './home/home.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'edit',
    component: EditComponent,
    canActivate: [
      AuthGuard
    ]},
  { path: 'create',
    component: CreateComponent,
    canActivate: [
      AuthGuard
    ]},
  { path: 'callback',
    component: CallbackComponent,
    canActivate: [
      AuthGuard
    ]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
