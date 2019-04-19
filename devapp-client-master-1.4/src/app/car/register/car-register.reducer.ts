import { Action } from '@app/core';
import { v4 as uuid } from 'uuid';

import { AppService } from '../../app.service';

export const initialState = {
  message: "",
  data: null,
  loading: false,
};

export const CAR_ADD = 'CAR_ADD';
export const CAR_CLEAR = 'CAR_CLEAR';
export const CAR_CREATE_SUCCESS = 'CAR_CREATE_SUCCESS ';
export const CAR_CREATE_FAILURE = 'CAR_CREATE_FAILURE ';

export const actionAddCar = (data: any) => ({
  type: CAR_ADD,
  payload: data
});

export const actionClearCar = () => ({
  type: CAR_CLEAR
});

export const selectorCar = state => state.car.register;

export function carRegisterReducer(state = initialState, action: Action) {
  switch (action.type) {
    case CAR_ADD:
      return Object.assign({}, state, {
        loading: true,
        data:    action.payload,
        message: ""
      });

    case CAR_CREATE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        message: action.payload,
      });

    case CAR_CREATE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        message: action.payload,
      });

    case CAR_CLEAR:
      return Object.assign({}, state, {
        loading: false,
        data:    null,
        message: ""
      });

    default:
      return state;
  }
}

export interface Car {
  "id": string,
  "name": string,
  "ownerId": string,
  "timestamp": string,
  "description": string
}
