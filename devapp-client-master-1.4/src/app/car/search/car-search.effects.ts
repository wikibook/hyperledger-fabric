import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError } from 'rxjs/operators/catchError';

import { LocalStorageService, Action } from '@app/core';

import {
  CAR_KEY,
  CAR_RETRIEVE,
  CAR_RETRIEVE_SUCCESS,
  CAR_RETRIEVE_ERROR
} from './car-search.reducer';
import { CarSearchService } from './car-search.service';

@Injectable()
export class CarSearchEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private service: CarSearchService
  ) {}

  @Effect()
  retrieveCar(): Observable<Action> {
    return this.actions$.ofType(CAR_RETRIEVE).pipe(
      tap(action =>
        this.localStorageService.setItem(CAR_KEY, {
          symbol: action.payload
        })
      ),
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(action =>
        this.service.retrieveCars().pipe(
          map(car => ({
            type: CAR_RETRIEVE_SUCCESS,
            payload: car
          })),
          catchError(err =>
            of({ type: CAR_RETRIEVE_ERROR, payload: err })
          )
        )
      )
    );
  }
}
