import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NbButtonModule } from '@nebular/theme';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, FontAwesomeModule, NbButtonModule],
  exports: [FooterComponent],
})
export class FooterModule {}
