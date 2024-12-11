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
      Authorization: `Bearer ffced6f5a370d3e08b3edb9827b32ed81146c03c99b5ad4d59de26b0a61b6ecee7759b2be7286f03461df49d70a655badf0ecf2632e67978993c441318fda0c3e5daa08e6ad910c97bb087f0d37783721f4ad870f1ce3c63bfa7cd36afc79ba096119538014d8fcc0a516904291bfdacb4cc078d21a934caaec84fc6486fd3dd`,
      Accept: 'application/json'
        });

    return headers
  }



}


