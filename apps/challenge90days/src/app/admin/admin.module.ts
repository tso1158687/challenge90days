import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import {
  NbListModule,
  NbSelectModule,
  NbCardModule,
  NbIconModule,
  NbDatepickerModule,
  NbInputModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import {NbDateFnsDateModule} from '@nebular/date-fns'
@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NbSelectModule,
    FormsModule,
    NbListModule,
    NbCardModule,
    NbIconModule,
    NbDatepickerModule,
    NbInputModule,
    NbDateFnsDateModule
  ],
})
export class AdminModule {}
