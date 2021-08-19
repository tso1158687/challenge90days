import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { NbMenuItem, NbMenuService, NbToastrService } from '@nebular/theme';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import * as AOS from 'aos';
import { filter, map, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
@Component({
  selector: 'challenge90days-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, OnDestroy {
  isMobileMode = true;
  showSecondNavbar = false;
  user$ = this.userService.user$;
  stop$ = new Subject();
  user: any;
  settingList: NbMenuItem[] = [
    { title: '打卡戰績', url: 'checkin/list', icon: 'browser-outline' },
    { title: '公告', url: 'announce', icon: 'message-circle-outline' },
    // { title: '成就', url: 'checkin/challenge', icon: 'award-outline' },
    // { title: '設定', url: 'settings', icon: 'settings-outline' },
  ];
  themeToggle = this.themeService.themeToggle;
  logoPath = '/assets/logo.jpeg';
  constructor(
    private router: Router,
    private authService: NbAuthService,
    private nbMenuService: NbMenuService,
    private toastrService: NbToastrService,
    private userService: UserService,
    private themeService: ThemeService,
    public auth: AngularFireAuth
  ) {}
  ngOnInit() {
    this.getWindowSizeEvent();
    this.getUserInfo();
    AOS.init();
    this.clickMenuItem();
  }

  ngOnDestroy() {
    this.stop$.next();
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
      console.log(this.user);
    });
  }

  changeMobileToggle(): void {
    this.showSecondNavbar = !this.showSecondNavbar;
  }

  hasUserData(): boolean {
    return Object.keys(this.user).length > 0;
  }

  getWindowSizeEvent(): void {
    this.isMobileMode = window.innerWidth <= 768;
    this.showSecondNavbar=!this.isMobileMode
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.stop$))
      .subscribe(() => {
        this.isMobileMode = window.innerWidth <= 768;
        this.showSecondNavbar=!this.isMobileMode
      });
  }
}
