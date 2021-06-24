import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { NbAuthService } from '@nebular/auth';
import { FireworkService } from './services/firework.service';
import { BehaviorSubject } from 'rxjs';
import { NbMenuItem, NbMenuService, NbToastrService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './services/user.service';
import { ThemeService } from './services/theme.service';
@Component({
  selector: 'challenge90days-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  user$ = this.userService.user$;
  showFirework$: BehaviorSubject<boolean>;
  user: any;
  settingList: NbMenuItem[] = [
    { title: '我的打卡', url: 'checkin/myself', icon: 'browser-outline' },
    { title: '成就', url: 'checkin/challenge', icon: 'award-outline' },
    { title: '公告', url: 'announce', icon: 'message-circle-outline' },
    { title: '設定', url: 'settings', icon: 'settings-outline' },
  ];
  themeToggle = this.themeService.themeToggle;

  constructor(
    private router: Router,
    private authService: NbAuthService,
    private fireworkService: FireworkService,
    private nbMenuService: NbMenuService,
    private toastrService: NbToastrService,
    private userService: UserService,
    private themeService: ThemeService,
    public auth: AngularFireAuth
  ) {}
  ngOnInit() {
    // this.authService.
    // firebase 驗證方法
    // this.auth.user.subscribe(e=>e.sendEmailVerification())
    this.getUserInfo();
    this.showFirework$ = this.fireworkService.showFirework$;
    AOS.init();
    this.clickMenuItem();
  }

  clickMenuItem() {
    console.log('click');
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map((e) => e.item)
      )
      .subscribe((title) => {
        this.router.navigate([title.url]);
      });
  }

  logout(): void {
    this.authService.logout('password').subscribe((e) => {
      this.toastrService.success('', '登出成功');
      this.router.navigate([e.getRedirect()]);
      location.reload();
    });
  }

  changeThemeMode(themeToggle: boolean): void {
    this.themeService.changeThemeMode(themeToggle);
  }

  getUserInfo(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
