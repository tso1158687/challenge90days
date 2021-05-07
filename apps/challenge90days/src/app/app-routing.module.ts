import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'checkin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/checkin/checkin.module').then((m) => m.CheckinModule),
  },
  {
    path: 'announce',
    loadChildren: () =>
      import('./pages/announce/announce.module').then((m) => m.AnnounceModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/intro/intro.module').then((m) => m.IntroModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
