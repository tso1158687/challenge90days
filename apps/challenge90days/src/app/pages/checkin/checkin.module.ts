import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinComponent } from './components/checkin.component';
import { CheckinRoutingModule } from './checkin-routing.module';
import { NbCardModule, NbButtonModule, NbInputModule, NbToastrService } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CheckinComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckinRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
  ]
})
export class CheckinModule { }
