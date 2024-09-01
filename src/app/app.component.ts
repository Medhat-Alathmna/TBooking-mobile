import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonMenu, MenuController } from '@ionic/angular';
import { isSet } from './core/base/base.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  authData = JSON.parse(localStorage.getItem('userAuth'))
   lang = localStorage.getItem('currentLang')

  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Our Site', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor( @Inject(DOCUMENT) private document: Document, private router :Router ,private translate: TranslateService,
  private menuController: MenuController) {
    this.getLang()

  }
   logout(){
    localStorage.removeItem('userAuth')
    this.router.navigateByUrl('/')
    location.reload()

  }
  moveToLogin(){
    this.router.navigateByUrl(this.authData?'/appoiments':'/login')
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
  changeLang(){
    localStorage.setItem('currentLang', this.lang !== "en" ? "en" : "ar")
    location.reload()
  }
}
