import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const API_URL = '/api/car';

@Injectable()
export class CarTransferService {
  constructor(private httpClient: HttpClient) {}
  transfer(car: any): Observable<any> {
    console.log('transfer:'+JSON.stringify(car))
    return this.httpClient
      .put(API_URL, car)
  }
}
