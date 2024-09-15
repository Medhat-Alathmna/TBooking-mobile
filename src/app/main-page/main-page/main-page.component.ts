import { Component, OnInit, signal } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Appointment } from 'src/app/modals/appoiments';
import { MainPageService } from '../main-page.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ServicesComponent } from '../services/services.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent extends BaseComponent implements OnInit {

  constructor(public modalController: ModalController, 
    private mainPageService: MainPageService,public translate: TranslateService,
    public loadingController: LoadingController,public router:Router,
    public toastController: ToastController) { super(loadingController, translate,toastController,router) }

  users = []
  selectServices = []
  appointment = new Appointment
  // closeCurrentTime = startOfHour(addMinutes(new Date(), Math.round(new Date().getMinutes() / 15) * 15));


  ngOnInit() {
    this.getNotfi()
    console.log(JSON.parse(localStorage.getItem('appointemts')));
    this.appointment.fromDate = new Date().toISOString()
    this.appointment.toDate = new Date().toISOString()
    this.appointment.employee=[]
    this.getUsers()
    this.servicesForm()
  }

  dismissModal() {
    this.modalController.dismiss();
  }
   pushToLocalStorageArray(key: string, value: any) {
    const existing = localStorage.getItem(key);
    const array = existing ? JSON.parse(existing) : [];
    array.push(value);
    localStorage.setItem(key, JSON.stringify(array));
  }

  addAppominet() {

    if (!this.selectServices.length) {
      this.presentToast('Please select your employee and then select your services')
      return
    }
    this.appointment.employee.services=this.selectServices
    this.appointment.phone=this.appointment.phone.toString();
    this.appointment.fromDate = new Date(this.appointment.fromDate).toISOString()
    this.appointment.toDate = new Date(this.appointment.toDate).toISOString()
    const subscription = this.mainPageService.addAppominets(this.appointment).subscribe((data:any) => {
      if (!isSet(data)) {
        return
      }
      this.pushToLocalStorageArray('appointemts',data.createAppo)
      this.presentToast('Booking Created , Please take a look at our Works')
      setTimeout(() => {
        this.router.navigateByUrl('/ads')
      }, 1500);
      subscription.unsubscribe()
    }, error => {
      this.presentErrorToast()
      subscription.unsubscribe()
    })
  }

  getUsers() {
    const subscription = this.mainPageService.getEmployee().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.users = data
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  async openServices() {
    const modal = await this.modalController.create({
      component: ServicesComponent,
    });
    return await modal.present();

  }
  servicesForm() {
    const subscription = this.mainPageService.addServicesToForm.subscribe((data) => {
      if (!isSet(data)) {
        return;
      }
      const existServ = this.selectServices.find(x => x.id == data.id)
      if (existServ) {
        this.presentToast(this.trans('This Service Already Selected'))
        return
      }      
      this.selectServices.push({
        id: data?.id,
        ar: data?.ar,
        en: data?.en,
        price: data?.price
      })
this.getTotalPrice()
      this.mainPageService.addServicesToForm.next(null);
    }, async (error) => {
      await this.presentErrorToast();
    });
    this.subscriptions.push(subscription);
  }
  getTotalPrice() {
    let serviceAmount: number = 0
    this.selectServices?.map(rs=>{
      serviceAmount +=rs.price
    })   
      
    return {serviceAmount}
  }
  selectDate(value) {
    const today=new Date().toISOString()
 
    this.appointment.fromDate = new Date(value).toISOString()
    console.log(this.appointment.fromDate);

    if ( this.appointment.fromDate <today) {
      setTimeout(() => {
        this.appointment.fromDate = today
      }, 1000);
       this.presentToast('You can not Booking  befor now')
    }
    this.dismissModal();

  }
  removeServices(index){
    this.selectServices.splice(index,1)
  }
  getNotfi() {
   
    const subscription = this.mainPageService.getNotfi().subscribe((results: any) => {
      this.loading = false

    console.log(results);
    
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      console.log(error);
      
      subscription.unsubscribe()
    })
  }
}
