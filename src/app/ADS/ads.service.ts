import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private api: ApiService) { }
  getPosts(): Observable<any> {
    return this.api.get<any>(`publishedPosts`);
  }
}
