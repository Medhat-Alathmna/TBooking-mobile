import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Appointment } from 'src/app/modals/appoiments';

@Component({
  selector: 'app-appoiments-form',
  templateUrl: './appoiments-form.component.html',
  styleUrls: ['./appoiments-form.component.scss'],
})
export class AppoimentsFormComponent  implements OnInit {

 @Input() appointment:any
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.appointment);
    
    this.appointment=this.appointment.attributes
    this.appointment.fromDate = new Date(this.appointment.fromDate)

  }


  dismissModal() {
    this.modalController.dismiss();
  }

}
