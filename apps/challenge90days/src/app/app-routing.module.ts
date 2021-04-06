import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/checkin/checkin.module').then((m) => m.CheckinModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/intro/intro.module').then((m) => m.IntroModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
