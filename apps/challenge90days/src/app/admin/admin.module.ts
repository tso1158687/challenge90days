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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { NbButtonModule } from '@nebular/theme';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
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
    NbDateFnsDateModule,
    NbButtonModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
})
export class AdminModule {}
