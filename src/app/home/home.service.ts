import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private api: ApiService) { }

  getMainSettings(): Observable<any> {
    return this.api.get<any>(`/main-settings-mobile`); 
   }
}
