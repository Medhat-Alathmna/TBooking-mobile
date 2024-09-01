import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { environment } from 'src/environments/environment';
import { UserToken } from '../modals/UserToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient,) {

  }


  public login(username: string, password: string): Observable<UserToken> {

    return this.httpClient.post<UserToken>(`${environment.apiUrl}/auth/local`,{
      identifier: username,
      password: password
    });
  }

  clearAuthData() {
    localStorage.removeItem('authData')
  }

  sendEmail(email): Observable<any>{
    let body={email}
    return this.httpClient.post<any>(`${environment.apiUrl}/auth/forgot-password `, body);

  }

}
