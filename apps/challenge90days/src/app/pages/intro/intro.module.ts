import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import { LandingComponent } from './components/landing/landing.component';
import { IntroComponent } from './components/intro/intro.component';
import { NbCardModule } from '@nebular/theme';



@NgModule({
  declarations: [
    IntroComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    IntroRoutingModule,
    NbCardModule
  ]
})
export class IntroModule { }
