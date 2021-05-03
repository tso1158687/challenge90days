import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import { LandingComponent } from './components/landing/landing.component';
import { IntroComponent } from './components/intro/intro.component';
import { NbCardModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareComponent } from './components/share/share.component';



@NgModule({
  declarations: [
    IntroComponent,
    LandingComponent,
    ShareComponent
  ],
  imports: [
    CommonModule,
    IntroRoutingModule,
    NbCardModule,
    // test
    ReactiveFormsModule
  ]
})
export class IntroModule { }
