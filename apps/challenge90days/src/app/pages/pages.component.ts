import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { NbMenuItem, NbMenuService, NbToastrService } from '@nebular/theme';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
import * as AOS from 'aos';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'challenge90days-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  mobileToggle = false;
  user$ = this.userService.user$;
  user: any;
  settingList: NbMenuItem[] = [
    { title: '我的打卡', url: 'checkin/myself', icon: 'browser-outline' },
    { title: '成就', url: 'checkin/challenge', icon: 'award-outline' },
    { title: '公告', url: 'announce', icon: 'message-circle-outline' },
    { title: '設定', url: 'settings', icon: 'settings-outline' },
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
    this.getUserInfo();
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

  changeMobileToggle() {
    this.mobileToggle = !this.mobileToggle;
  }
}
