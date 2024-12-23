import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonMenu, MenuController } from '@ionic/angular';
import { isSet } from './core/base/base.component';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from './home/home.service';
import { PermissionService } from './core/permission.service';


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
  settings
  paletteToggle: any = false;


 
  constructor(@Inject(DOCUMENT) private document: Document, private homeService: HomeService,public permissionService:PermissionService,
    private router: Router, private translate: TranslateService,
    private menuController: MenuController) {
      if (isSet(this.authData)) {
        this.getMe()
      }
    this.getLang()
    this.getSettings()
    this.getCurrencies()
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
      sessionStorage.setItem('prev',JSON.stringify(user.privilege.pages))
   await   this.permissionService.setPermissions(user.privilege.pages);
      subscription.unsubscribe()
    }, error => {
      this.logout()
      subscription.unsubscribe()
    })
  }

}
