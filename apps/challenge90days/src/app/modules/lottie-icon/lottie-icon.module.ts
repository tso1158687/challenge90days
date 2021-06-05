import { NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';

export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  imports: [LottieModule.forRoot({ player: playerFactory, useCache: true })],
  exports: [LottieModule]
})
export class LottieIconModule { }
