import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinComponent } from './components/checkin.component';
import { CheckinRoutingModule } from './checkin-routing.module';
import { NbCardModule, NbButtonModule, NbInputModule, NbToastrService } from '@nebular/theme';



@NgModule({
  declarations: [
    CheckinComponent
  ],
  imports: [
    CommonModule,
    CheckinRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    

  ]
})
export class CheckinModule { }
