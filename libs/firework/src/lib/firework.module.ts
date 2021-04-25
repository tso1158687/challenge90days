import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FireworkComponent } from './components/firework/firework.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FireworkComponent
  ],
  exports:[FireworkComponent]
})
export class FireworkModule {}
