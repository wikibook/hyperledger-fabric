import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { Car } from './car-search.reducer';

const API_URL = '/api/car';

@Injectable()
export class CarSearchService {
  constructor(private httpClient: HttpClient) {}
  retrieveCars(): Observable<Array<Car>> {
    return this.httpClient
      .get(API_URL, { responseType: 'text' })
      .pipe(
        map((res: string) => JSON.parse(res.replace('//', '')))
      );
  }
}
