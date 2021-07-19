import { NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';

export function playerFactory() {
  return import('lottie-web');
  // return import('lottie-web/build/player/lottie_light')
}

@NgModule({
  imports: [LottieModule.forRoot({ player: playerFactory, useCache: true })],
  exports: [LottieModule]
})
export class LottieIconModule {}
