import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './components/checkin.component';
import { ChallenageComponent } from './components/challenage/challenage.component';
import { MyselfComponent } from './components/myself/myself.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: CheckinComponent,
  },
  // {
  //   path: 'challenge',
  //   component: ChallenageComponent,
  // },
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: ':docPath',
    component: MyselfComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinRoutingModule {}
