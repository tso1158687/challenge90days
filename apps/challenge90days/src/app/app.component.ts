import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { footerData } from './data/footer';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { FireworkService } from './services/firework.service';
import { BehaviorSubject } from 'rxjs';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { filter, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'challenge90days-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showFirework$: BehaviorSubject<boolean>;
  user: any = {};
  footerData = footerData;
  settingList: NbMenuItem[] = [
    { title: '我的打卡', url: 'checkin/myself',icon: 'browser-outline'  },
    { title: '成就', url: 'checkin/challenge',icon: 'award-outline'  },
    { title: '公告', url: 'announce',icon: 'message-circle-outline'  },
    { title: '設定', url: 'settings', icon: 'settings-outline' },
    { title: '登出', url: 'logout',icon: 'message-circle-outline'  },
  ];

  constructor(
    private router: Router,
    private authService: NbAuthService,
    private fireworkService: FireworkService,
    private nbMenuService: NbMenuService
  ) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      console.log(token);
      console.log(token.isValid());
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
        console.log(this.user);
      }
    });
  }
  ngOnInit() {
    this.showFirework$ = this.fireworkService.showFirework$;
    AOS.init();
    this.clickMenuItem();
  }

  clickMenuItem() {
    console.log('click')
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map((e) => e.item)
      )
      .subscribe((title) => {
        console.log(title.url)
        if(title.url!=='logout'){
          this.router.navigate([title.url]);
        }else{
          this.logout()
        }
      });
  }

  logout(){
    console.log('logout')
    this.authService.logout('password').pipe(take(1)).subscribe(e=>{
      console.log(e)
    })
    // this.authService.refreshToken('email')
  }
}
