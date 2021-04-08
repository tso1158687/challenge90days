import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {
  NbAuthComponent,
  NbLoginComponent,
} from '@nebular/auth';



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
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class AuthModule { }
