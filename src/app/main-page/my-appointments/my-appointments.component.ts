import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss'],
})
export class MyAppointmentsComponent  implements OnInit {

  appointments:any
  constructor() { }

  ngOnInit() {}

}
