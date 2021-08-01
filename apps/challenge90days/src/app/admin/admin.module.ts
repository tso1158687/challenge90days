import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin/admin.component';
import {
  NbListModule,
  NbSelectModule,
  NbCardModule,
  NbIconModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';

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
  ],
})
export class AdminModule {}
