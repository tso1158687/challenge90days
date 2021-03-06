import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/intro/intro.component';
import { LandingComponent } from './components/landing/landing.component';
import { ShareComponent } from './components/share/share.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path:'introduction',
    component:IntroComponent
  },
  {
    path:'share',
    component:ShareComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroRoutingModule { }
