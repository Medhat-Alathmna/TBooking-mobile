import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicesComponent } from './services/services.component';
import { TranslateModule } from '@ngx-translate/core';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';


export const routes: Routes = [
  { path: '', component: BookingPageComponent },
  { path: 'my-appo', component: MyAppointmentsComponent },

];


@NgModule({
  declarations: [BookingPageComponent,ServicesComponent,MyAppointmentsComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(routes),  ]
})
export class BookingPageModule { }
