import { DOCUMENT } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonMenu, MenuController } from '@ionic/angular';
import { isSet } from './core/base/base.component';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from './home/home.service';
import { PermissionService } from './core/permission.service';
import * as Device from 'expo-device';
import { AuthService } from './auth/auth.service';
import { PushNotifications, Token, PermissionStatus } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

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



  constructor(@Inject(DOCUMENT) private document: Document, private platform: Platform, private homeService: HomeService, public permissionService: PermissionService, private userService: AuthService,
    private router: Router, private translate: TranslateService,
    private menuController: MenuController) {

    this.platform.ready().then(() => {
      if (isSet(this.authData)) {
        this.getMe()
      }
      this.initPush();
      this.getLang()
      this.getSettings()
      this.getCurrencies()
    });

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
    const subscription = this.homeService.getMainSettings().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.settings = data.data.attributes
      localStorage.setItem('settings', JSON.stringify(this.settings))

      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  getCurrencies() {
    const subscription = this.homeService.getCurrencies().subscribe((results: any) => {
      localStorage.setItem('currency', JSON.stringify(results.data.attributes))

      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  getMe() {
    const subscription = this.homeService.getMe().subscribe(async (user: any) => {
      sessionStorage.setItem('prev', JSON.stringify(user.privilege.pages))
      await this.permissionService.setPermissions(user.privilege.pages);
      subscription.unsubscribe()
    }, error => {
      this.logout()
      subscription.unsubscribe()
    })
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

      // Permission granted — proceed to register
      PushNotifications.register();

      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token:', token.value);
        // this.sendTokenToStrapi(token.value);
        localStorage.setItem('expoPushToken', token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Notification tapped:', notification);
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

