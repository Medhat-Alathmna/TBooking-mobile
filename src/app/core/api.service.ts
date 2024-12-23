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
      Authorization: `Bearer 0fa49ce512ccd8a26da8f37242103941ada332b7cfd237b20a78901e052c4cf55da7b1319929467a2cb8218cb7f634b42a73a87fb4982c12a41891265b47473bc96609e85b8d9d1e97c5624ea26553c57a81b4a20404ab8d3af0791a5082408b5c3ff6ea653ca2486de3991eba8d982be2fdddaacba0e2d36639aebeb4bd3f15`,
      Accept: 'application/json'
        });

    return headers
  }



}


