import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnounceComponent } from './components/announce/announce.component';
import { AnnounceRoutingModule } from './announce-routing.module';



@NgModule({
  declarations: [
    AnnounceComponent
  ],
  imports: [
    CommonModule,
    AnnounceRoutingModule
  ]
})
export class AnnounceModule { }
