import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from 'src/app/core/base/base.component';
import { AppoimentsFormComponent } from 'src/app/user-pages/appoiments/appoiments-form/appoiments-form.component';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
})
export class MyAppointmentsComponent extends BaseComponent  implements OnInit {

  appointments=JSON.parse(localStorage.getItem('appointemts'))
  constructor(private modalController: ModalController,) {super() }

  ngOnInit() {}


  async appoimentForm(appointment?) {
    const modal = await this.modalController.create({
      component: AppoimentsFormComponent,
      componentProps: { appointment,isUser:false },
    });

    return await modal.present();

  }
  search(data){
    const query = data.toLowerCase();
    this.appointments = this.appointments.filter((d) => d.number.toLowerCase().indexOf(query) > -1);    
  }
}
