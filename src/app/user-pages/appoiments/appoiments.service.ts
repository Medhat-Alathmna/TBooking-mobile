import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Appointment } from 'src/app/modals/appoiments';

@Injectable({
  providedIn: 'root'
})
export class AppoimentsService {

  constructor(private api: ApiService) { }
  getTodayAppominets(currentDate,nextCurrentDate?): Observable<any[]> {
    return this.api.get<any[]>(`appointments?populate=*&filters[hide][$eq]=false&filters[fromDate][$gte]=${currentDate}`);
  }
  getAppominets(number): Observable<Appointment[]> {
    return this.api.get<Appointment[]>(`appointments?populate=*&filters[number][$contains]=${number}`);
  }
}
