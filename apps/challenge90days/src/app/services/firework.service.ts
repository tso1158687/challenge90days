import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FireworkService {
  showFirework$ = new BehaviorSubject(false);
  constructor() {
    // this.showFirework$.pipe(delay(5000)).subscribe(() => {
    //   console.log('??')
    //     this.showFirework$.next(false);
      
    // });
  }

  showFirework(){
    this.showFirework$.next(true)
    setTimeout(() => {
      this.showFirework$.next(false)
    }, 5000);
  }
}
