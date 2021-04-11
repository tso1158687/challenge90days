import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinComponent } from './components/checkin.component';
import { ChallenageComponent } from './components/challenage/challenage.component';

export const routes: Routes = [
  {
    path: '',
    component: CheckinComponent,
  },
  {
    path: 'challenge',
    component: ChallenageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinRoutingModule {}
