import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@challenge90days/api-interfaces';
import * as AOS from 'aos';
import { footerData } from './data/footer';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { FireworkService } from './services/firework.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'challenge90days-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showFirework$: BehaviorSubject<boolean>;
  user: any = {};
  footerData = footerData;
  items = [
    { title: 'Profile' },
    { title: 'Logout' },
  ];
  constructor(
    private authService: NbAuthService,
    private http: HttpClient,
    private fireworkService: FireworkService
  ) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
        console.log(this.user);
      }
    });
  }
  ngOnInit() {
    this.showFirework$ = this.fireworkService.showFirework$;
    AOS.init();
    // this.authService.
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
}
