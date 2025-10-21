import { DOCUMENT } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonMenu, MenuController, Platform } from '@ionic/angular';
import { isSet } from './core/base/base.component';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from './home/home.service';
import { PermissionService } from './core/permission.service';
import * as Device from 'expo-device';
import { AuthService } from './auth/auth.service';
import { PushNotifications, Token, PermissionStatus } from '@capacitor/push-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  authData = JSON.parse(localStorage.getItem('userAuth'))
  lang = localStorage.getItem('currentLang')
  isDark: boolean = JSON.parse(localStorage.getItem('isDark'))
  themeMode
  userId: string = this.authData?.id;
  settings
  paletteToggle: any = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private platform: Platform,
    private homeService: HomeService,
    public permissionService: PermissionService,
    private userService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // The splash screen is shown by default. We'll hide it after our tasks are complete.
    try {
      const initialzationTasks = [
        this.getLang(),
        this.getSettings(),
        this.getCurrencies(),
        this.initPush(),
      ];

      if (isSet(this.authData)) {
        initialzationTasks.push(this.getMe());
      }

      await Promise.all(initialzationTasks);

    } catch (error) {
      console.error('Initialization failed:', error);
    } finally {
      // This will run regardless of whether the promises succeeded or failed.
      SplashScreen.hide();
    }

    if (!isSet(this.isDark)) {
      this.paletteToggle = true
      localStorage.setItem('isDark', this.paletteToggle)
    }
    const prefersDark = window.matchMedia(`(prefers-color-scheme: ${this.isDark ? 'dark' : 'light'})`);
    this.initializeDarkPalette(prefersDark.matches);
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }

  initializeDarkPalette(isDark) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleChange(ev) {
    localStorage.setItem('isDark', ev.detail.checked)
    this.toggleDarkPalette(ev.detail.checked);
  }

  toggleDarkPalette(shouldAdd) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  logout() {
    localStorage.removeItem('userAuth')
    this.router.navigateByUrl('/')
    location.reload()
  }

  moveToLogin() {
    this.router.navigateByUrl(this.authData ? '/' : '/login')
  }

  getLang() {
    if (!localStorage.getItem('currentLang')) {
      localStorage.setItem('currentLang', 'en')
    }
    const lang = localStorage.getItem('currentLang')
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    const htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = lang !== "en" ? "rtl" : "ltr";
  }

  changeLang() {
    localStorage.setItem('currentLang', this.lang !== "en" ? "en" : "ar")
    location.reload()
  }

  getSettings() {
    return firstValueFrom(this.homeService.getMainSettings()).then(data => {
      if (isSet(data)) {
        this.settings = data.data.attributes;
        localStorage.setItem('settings', JSON.stringify(this.settings));
      }
    });
  }

  getCurrencies() {
    return firstValueFrom(this.homeService.getCurrencies()).then((results: any) => {
      localStorage.setItem('currency', JSON.stringify(results.data.attributes));
    });
  }

  async getMe() {
    try {
      const user: any = await firstValueFrom(this.homeService.getMe());
      sessionStorage.setItem('prev', JSON.stringify(user.privilege.pages));
      await this.permissionService.setPermissions(user.privilege.pages);
    } catch (error) {
      this.logout();
    }
  }
  
  async initPush() {
    try {
      const permissionStatus: PermissionStatus = await PushNotifications.checkPermissions();

      if (permissionStatus.receive !== 'granted') {
        const requestStatus = await PushNotifications.requestPermissions();

        if (requestStatus.receive !== 'granted') {
          console.warn('Push permission not granted.');
          return;
        }
      }

      await PushNotifications.register();

      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token:', token.value);
        localStorage.setItem('expoPushToken', token.value);
      });

    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }
  
  sendTokenToStrapi(token: string) {
    this.userService.updateUser(this.userId, token).subscribe({
      next: (response) => {
        console.log('Expo push token updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating Expo push token:', error);
      }
    });
  }
}