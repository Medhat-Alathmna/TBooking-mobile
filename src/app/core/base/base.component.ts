import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe, getCurrencySymbol } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base',
  template: '',
  standalone: true,

})
export class BaseComponent implements  OnDestroy {

  subscriptions: Subscription[] = [];
  public loading = false;
  // closeCurrentTime = startOfHour(addMinutes(new Date(), Math.round(new Date().getMinutes() / 15) * 15));
  cur = JSON.parse(localStorage.getItem('currency'))

  userAuth =JSON.parse(localStorage.getItem('userAuth'))?.user
  lang = localStorage.getItem('currentLang')

  public loadingIndicator;

  constructor(public loadingController?: LoadingController,public translates?: TranslateService,
    public toastController?: ToastController,
    public router?: Router,
    public nav?: NavController) {

  }


  ngOnDestroy() {
    this.unsubscribeAll(this.subscriptions);
  }

  public unsubscribeAll(subscriptions: Subscription[] = null): void {
    try {
      subscriptions.forEach((subscription: Subscription) => {
        if (isSet(subscription) && !subscription.closed) {
          subscription.unsubscribe();
        }
      });
    } catch (error) {
    }
  }


  minString(word: string, length?) {
    if (!isSet(length)) length = 25
    if (word?.length > length) {
      return word.slice(0, length) + '...';
    } else {
      return word;
    }
  }
  arrayInsert(array,index, ...items){
     return array.splice( index, 0, ...items )    
  
  }
  
  multiReplace(text, replacements) {
    for (const oldStr in replacements) {
      if (replacements.hasOwnProperty(oldStr)) {
        const newStr = replacements[oldStr];
        const regex = new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        text = text.replace(regex, newStr);
      }
    }
    return text;
  }
 
  public async showLoading(message?) {
    this.loading = true;
    this.loadingIndicator = await this.loadingController.create({
      message: `${message}...`
    }).catch(err=>{
      console.log(err);
      this.presentToast(err);
      this.dismissLoading();
    });
    await this.loadingIndicator.present();
  }
  public async dismissLoading() {
    console.log('dismissLoading');
    await this.loadingIndicator.dismiss();

    this.loading = false;

  }

  public async presentToast(msg: string = '') {
    const toast = await this.toastController.create({
      message:msg? `${msg}`:'Unknown Error',
            duration: 4000
    });
    await toast.present();
  }

  public async presentErrorToast() {
    const toast = await this.toastController.create({
      message:'Something wrong !',
      duration: 4000
    });
    toast.present();
  }
  trans(key: any): any {
    return this.translates?.instant(key)
  }
  public getCurrencySymbol(code?: string, format?: 'wide' | 'narrow', locale?: string): string {
    if(!isSet(format)) {
      format = 'narrow';
    }
    return getCurrencySymbol(code, format, locale);
  }
}
export const isSet = (value: any): boolean => {
  return value !== null && value !== undefined && value !== '' && value?.length !== 0 ;;
};

