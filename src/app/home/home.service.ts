import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private api: ApiService) { }

  getMainSettings(): Observable<any> {
    return this.api.getGuest<any>(`/main-settings-mobile`); 
   }
   getCurrencies(): Observable<any> {
    return this.api.getGuest<any>(`/currency`); 
   }
}
