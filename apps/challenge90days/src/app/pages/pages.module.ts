import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { FooterModule } from '../modules/footer/footer.module';
import { NbLayoutModule, NbToggleModule, NbButtonModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    NbLayoutModule,
    NbToggleModule,
    NbButtonModule,
    FormsModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
