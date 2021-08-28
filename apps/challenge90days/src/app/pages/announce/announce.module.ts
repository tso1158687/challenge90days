import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnounceComponent } from './components/announce/announce.component';
import { AnnounceRoutingModule } from './announce-routing.module';
import { NbCardModule, NbIconModule, NbSpinnerModule } from '@nebular/theme';

@NgModule({
  declarations: [AnnounceComponent],
  imports: [CommonModule, AnnounceRoutingModule, NbIconModule,NbCardModule,NbSpinnerModule],
})
export class AnnounceModule {}
