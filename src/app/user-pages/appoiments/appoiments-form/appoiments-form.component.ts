import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from 'src/app/core/base/base.component';
import { Appointment } from 'src/app/modals/appoiments';

@Component({
  selector: 'app-appoiments-form',
  templateUrl: './appoiments-form.component.html',
  styleUrls: ['./appoiments-form.component.scss'],
})
export class AppoimentsFormComponent extends BaseComponent  implements OnInit {

 @Input() appointment:any
 @Input() isUser:boolean=true
  constructor(private modalController: ModalController) {super() }

  ngOnInit() {
    console.log(this.appointment);
    
    this.appointment=this.isUser?this.appointment.attributes:this.appointment
    this.appointment.fromDate = new Date(this.appointment.fromDate)

  }


  dismissModal() {
    this.modalController.dismiss();
  }

}
