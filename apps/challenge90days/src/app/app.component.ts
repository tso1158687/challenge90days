import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { FireworkService } from './services/firework.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'challenge90days-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showFirework$: BehaviorSubject<boolean>;

  constructor(
    private fireworkService: FireworkService,
  ) {}
  ngOnInit() {
    this.showFirework$ = this.fireworkService.showFirework$;
    AOS.init();
  }
}
