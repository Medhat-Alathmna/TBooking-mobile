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
  currentDay = moment(new Date()).format('YYYY-MM-DD')
  constructor(private appoimentsServices: AppoimentsService,
     public loadingController: LoadingController,
    private modalController: ModalController, private datePipe: DatePipe,
    private actionSheetCtrl: ActionSheetController,public translate?: TranslateService,) { super(loadingController,translate) }

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

  async getTodayAppo() {
    this.unapprovedAppoit = []
    this.approvedAppointments = []
    this.completedAppoit = []
    await this.showLoading('Appoiments Loading')
    const subscription = this.appoimentsServices.getTodayAppominets(this.currentDateGlobal).subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      let objects: any[] = []
      objects = results.data
      this.unapprovedAppoit = objects.filter(x => x.attributes.approved == false)
      this.approvedAppointments = objects.filter(x => x.attributes.approved == true && x.attributes.status === 'Draft' && (x.attributes.fromDate = moment(new Date(x.attributes.fromDate)).format('YYYY-MM-DD')) == this.currentDay)
      this.completedAppoit = objects.filter(x => x.attributes.status === 'Completed')
      this.listHeader = this.trans('Approved Appointments')
      this.currentAppoiments = this.approvedAppointments
      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()
      subscription.unsubscribe()
    })
  }


  async appoimentForm(appointment?) {
    const modal = await this.modalController.create({
      component: AppoimentsFormComponent,
      componentProps: { appointment },
    });
    console.log(appointment);

    return await modal.present();

  }
  handleRefresh(event) {
    setTimeout(() => {
      this.getTodayAppo()
      event.target.complete();
    }, 2000);
  }
}
