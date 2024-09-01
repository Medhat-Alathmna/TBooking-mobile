import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../modals/appoiments';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class MainPageService {


  public addServicesToForm: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public addServicesToFormEmitter: Observable<any> = this.addServicesToForm.asObservable();

  constructor(private api: ApiService) { }


  addAppominets(appointment: Appointment): Observable<Appointment> {
    
    let body = {
      address: appointment?.address,
      fromDate: appointment.fromDate,
      toDate: appointment.fromDate,
      notes: appointment?.notes,
      employee: appointment?.employee,
      firstName: appointment.firstName,
      middleName: appointment.middleName,
      lastName: appointment.lastName,
      phone: appointment.phone,


    }
    return this.api.post<Appointment>('/booking', body);
  }
  servicesMobile(): Observable<any> {
    return this.api.get<any>('/servicesMobile');
  }
  getEmployee(): Observable<any[]> {
    return this.api.get<any[]>(`usersMobile?populate=role&filters[hide][$eq]=false&filters[blocked][$eq]=false&filters[isToday][$eq]=true`);
  }
}
