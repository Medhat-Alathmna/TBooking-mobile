import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface HttpOptions {
  post<T>(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  user=JSON.parse(localStorage.getItem('userAuth'))

  private readonly apiUrl
  private bearerToken;
  
  constructor(private httpClient: HttpClient) {
    let url = environment.apiUrl;
    if (url.charAt(url.length - 1) === '/') {
      url = url.slice(0, url.length - 1);
    }
    this.apiUrl = url;    
    this.bearerToken = this.user?.jwt
  }


  post<T>(url: string, body: any | null): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.post<T>(`${this.apiUrl}${url}`, body, {
      headers: this.getHeaders()
    });
  }

  patch<T>(url: string, body: any | null): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.patch<T>(`${this.apiUrl}${url}`, body, {
      headers: this.getHeaders()
    });
  }

  put<T>(url: string, body: any | null): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.put<T>(`${this.apiUrl}${url}`, body, {
      headers: this.getHeaders()
    });
  }

  get<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;


    return this.httpClient.get<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeaders()
    })
  }
  getGuest<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;


    return this.httpClient.get<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeadersGuest()
    })
  }

  getFile<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.get<T>(`${this.apiUrl}${url}`, {
      responseType:'blob' as 'json',
      headers: this.getHeaders()
    })
  }

  delete<T>(url: string): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;


    return this.httpClient.delete<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeaders()
    })
  }
  deletebody<T>(url: string,body): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;

    return this.httpClient.delete<T>(`${this.apiUrl}${url}`, {
      headers: this.getHeaders(),
      body:body
    })
  }

  postGuest<T>(url: string, body: any | null): Observable<T> {
    const headers = new HttpHeaders({
      'Accept-Language':localStorage.getItem('currentLang'),
    });
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.post<T>(`${this.apiUrl}${url}`, body,{
      headers
    });
  }
  deleteBody<T>(url: string, body: any | null, options?: HttpOptions): Observable<T> {
    url = url.charAt(0) === '/' ? url : `/${url}`;
    return this.httpClient.delete<T>(`${this.apiUrl}${url}`, { body ,
      headers: this.getHeaders()});
  }
  private getHeaders() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.bearerToken}`,
      Accept: 'application/json'
        });

    return headers
  }
  private getHeadersGuest() {
    const headers = new HttpHeaders({
      Authorization: `Bearer 6936ad0bfde28598e9cd459495ceebc299db6c844deb7001d69c046a35a54f171b258d8584cb52ffccb5dc6452bd252cde47b8735a89b111e82c1c806269258cbeaec19c469d1488775736340363494dd60123236ad3d8b37ba4236bc56a14a9179810baaa58c4421f1c0ebb8c899e442f6de7792c1d3838669755e415c651db`,
      Accept: 'application/json'
        });

    return headers
  }



}


