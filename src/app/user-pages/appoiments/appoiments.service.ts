import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';

@Injectable({
  providedIn: 'root'
})
export class AppoimentsService {

  constructor(private api: ApiService) { }
  getTodayAppominets(currentDate,nextCurrentDate?): Observable<any[]> {
    return this.api.get<any[]>(`appointments?populate=*&filters[hide][$eq]=false&filters[fromDate][$gte]=${currentDate}`);
  }
}
