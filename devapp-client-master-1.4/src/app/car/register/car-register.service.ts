import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { Car } from './car-register.reducer';

const API_URL = '/api/car';

@Injectable()
export class CarRegisterService {
  constructor(private httpClient: HttpClient) {}
  create(car: Car): Observable<any> {
    console.log('create:'+JSON.stringify(car))
    return this.httpClient
      .post(API_URL, car)
  }
}
