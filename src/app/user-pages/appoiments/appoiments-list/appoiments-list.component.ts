import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';

import { Appointment } from 'src/app/modals/appoiments';
import { AppoimentsService } from '../appoiments.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { ProductFormComponent } from '../../Products/product-form/product-form.component';
import { AppoimentsFormComponent } from '../appoiments-form/appoiments-form.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appoiments-list',
  templateUrl: './appoiments-list.component.html',
  styleUrls: ['./appoiments-list.component.scss'],
  providers: [DatePipe]
})
export class AppoimentsListComponent extends BaseComponent implements OnInit {

  Appointments: any = []
  approvedAppointments: any = []
  unapprovedAppoit: any = []
  completedAppoit: any = []
  currentAppoiments: any = []
  actionSheetButtons
  class = 'Unpaid'
  listHeader = this.trans('Approved Appointments')

  currentDateGlobal = moment(new Date()).format('YYYY-MM-DDT00:00')
  constructor(private appoimentsServices: AppoimentsService,
    public loadingController: LoadingController,
    private modalController: ModalController, private datePipe: DatePipe,
    private actionSheetCtrl: ActionSheetController, public translate?: TranslateService,) { super(loadingController, translate) }

  ngOnInit() {
    this.getTodayAppo()

  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.trans('Appointments'),
      buttons: [
        {
          text: this.trans('Approved Appointments'),

          handler: () => {
            this.listHeader = this.trans('Approved Appointments'),
              this.currentAppoiments = this.approvedAppointments
            this.class = 'Unpaid'
          },

        },
        {
          text: this.trans('Completed Appointments'),

          handler: () => {
            this.listHeader = this.trans('Completed Appointments'),
              this.currentAppoiments = this.completedAppoit,
              console.log(this.currentAppoiments);

            this.class = 'Completed'

          },

        },
        {
          text: this.trans('Unapproved Appointments'),
          handler: () => {
            this.listHeader = this.trans('Unapproved Appointments'),
              this.currentAppoiments = this.unapprovedAppoit
            this.class = 'Canceled'
          },

        },
      ],
    });

    await actionSheet.present();
  }

  async getTodayAppo(currentDay = moment(new Date()).format('YYYY-MM-DD')) {
    this.unapprovedAppoit = []
    this.approvedAppointments = []
    this.completedAppoit = []
    await this.showLoading(this.trans('Appoiments Loading'))
    const subscription = this.appoimentsServices.getTodayAppominets(this.currentDateGlobal).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      let objects: any[] = []
      objects = results.data
      this.unapprovedAppoit = objects.filter(x => x.attributes.approved == false && (x.attributes.fromDate = moment(new Date(x.attributes.fromDate)).format('YYYY-MM-DD')) === currentDay)
      this.approvedAppointments = objects.filter(x => x.attributes.approved == true && x.attributes.status === 'Draft' && (x.attributes.fromDate = moment(new Date(x.attributes.fromDate)).format('YYYY-MM-DD')) === currentDay)
      this.completedAppoit = objects.filter(x => x.attributes.status === 'Completed' && (x.attributes.fromDate = moment(new Date(x.attributes.fromDate)).format('YYYY-MM-DD')) === currentDay)
      this.listHeader = this.trans('Approved Appointments')
      this.currentAppoiments = this.approvedAppointments
      this.class = 'Unpaid'
      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()
      subscription.unsubscribe()
    })
  }
  selectDate(value) {
    if (!isSet(value)) {
      this.currentDateGlobal = moment(new Date()).format('YYYY-MM-DDT00:00')
      this.getTodayAppo()
      this.dismissModal();

      return
    }
    this.currentDateGlobal = moment(new Date(value)).format('YYYY-MM-DDT00:00')
    const selectDate = moment(new Date(this.currentDateGlobal)).format('YYYY-MM-DD')
    this.getTodayAppo(selectDate)
    this.dismissModal();

  }
  dismissModal() {
    this.modalController.dismiss();
  }
  async appoimentForm(appointment?) {
    const modal = await this.modalController.create({
      component: AppoimentsFormComponent,
      componentProps: { appointment, isUser:true },
    });
    console.log(appointment);

    return await modal.present();

  }
  handleRefresh(event) {
    setTimeout(() => {
      this.getTodayAppo(null)
      event.target.complete();
    }, 2000);
  }
  search(data){
    const query = data.toLowerCase();
    this.getAppointemtByNumber(query)
    // this.products = this.products.filter((d) => d.attributes.name.toLowerCase().indexOf(query) > -1);    
  }
  async getAppointemtByNumber(number){
    this.unapprovedAppoit = []
    this.approvedAppointments = []
    this.completedAppoit = []
    await this.showLoading('Appoiments Loading')
    const subscription = this.appoimentsServices.getAppominets(number).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      let objects: any[] = []
      objects = results.data
      this.unapprovedAppoit = objects.filter(x => x.attributes.approved == false )
      this.approvedAppointments = objects.filter(x => x.attributes.approved == true )
      this.completedAppoit = objects.filter(x => x.attributes.status === 'Completed')
      this.listHeader = this.trans('Approved Appointments')
      this.currentAppoiments = this.approvedAppointments
      this.class = 'Unpaid'
      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()
      subscription.unsubscribe()
    })
  }
}
