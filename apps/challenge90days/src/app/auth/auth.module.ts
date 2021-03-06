import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import {
  NbAuthComponent,
  NbLoginComponent,
} from '@nebular/auth';
import { NbButtonModule, NbInputModule, NbSpinnerModule, NbSelectModule } from '@nebular/theme';
import { RegisterComponent } from './components/register/register.component';




const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },

];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
    NbSelectModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [
    RegisterComponent,
  ],
})
export class AuthModule { }
