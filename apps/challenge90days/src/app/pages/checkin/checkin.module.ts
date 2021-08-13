import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinComponent } from './components/checkin.component';
import { CheckinRoutingModule } from './checkin-routing.module';
import {
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbToastrService,
  NbIconModule,
  NbCalendarModule,
  NbToggleModule,
  NbButtonGroupModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbTabsetModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChallenageComponent } from './components/challenage/challenage.component';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { environment } from 'apps/challenge90days/src/environments/environment';
import { MyselfComponent } from './components/myself/myself.component';
import { CheckinCardComponent } from './components/checkin-card/checkin-card.component';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [CheckinComponent, ChallenageComponent, MyselfComponent, CheckinCardComponent,ListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CheckinRoutingModule,
    AngularFireStorageModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbTabsetModule,
    NbCalendarModule,
    NbToggleModule,
    NbButtonGroupModule,
    NbCheckboxModule,
  ],
  providers: [
    { provide: BUCKET, useValue: environment.firebase.storageBucket },
  ],
})
export class CheckinModule {}
