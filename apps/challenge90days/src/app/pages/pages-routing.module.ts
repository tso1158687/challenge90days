import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { PagesComponent } from './pages.component';
import { AdminModule } from '../admin/admin.module';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'checkin',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./checkin/checkin.module').then((m) => m.CheckinModule),
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminModule),
      },
      // {
      //   path: 'announce',
      //   loadChildren: () =>
      //     import('./announce/announce.module').then((m) => m.AnnounceModule),
      // },
      {
        path: '',
        loadChildren: () =>
          import('./intro/intro.module').then((m) => m.IntroModule),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
