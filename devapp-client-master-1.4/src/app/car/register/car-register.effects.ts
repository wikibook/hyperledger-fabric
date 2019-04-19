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
  CAR_ADD,
  CAR_CREATE_SUCCESS,
  CAR_CREATE_FAILURE
} from './car-register.reducer';
import { CarRegisterService } from './car-register.service';

@Injectable()
export class CarRegisterEffects {
  constructor(
    private actions$: Actions<Action>,
    private service: CarRegisterService
  ) {}

  @Effect()
  addIssue(): Observable<Action> {
    return this.actions$
      .ofType(CAR_ADD)
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap(action =>
          this.service.create(action.payload).pipe(
            map(res => ({
              type: CAR_CREATE_SUCCESS,
              payload: res
            })),
            catchError(err =>
              of({
                type: CAR_CREATE_FAILURE,
                payload: err
              })
            )
          )
        )
      );
  }
}
