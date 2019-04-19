import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const API_URL = '/api/user';

@Injectable()
export class AppService {
  constructor(private httpClient: HttpClient) {}
  getUser(): Observable<any> {
    return this.httpClient
      .get(API_URL)
  }


  logout(): Observable<any> {
    return this.httpClient
      .delete(API_URL)
  }
}
