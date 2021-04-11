import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinComponent } from './components/checkin.component';
import { CheckinRoutingModule } from './checkin-routing.module';
import { NbCardModule, NbButtonModule, NbInputModule, NbToastrService, NbIconModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ChallenageComponent } from './components/challenage/challenage.component';



@NgModule({
  declarations: [
    CheckinComponent,
    ChallenageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckinRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule
  ]
})
export class CheckinModule { }
