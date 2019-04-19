import { Action } from '@app/core';

export const initialState = {};

export const CAR_KEY = 'CAR.SEARCH';
export const CAR_RETRIEVE = 'CAR_RETRIEVE';
export const CAR_RETRIEVE_SUCCESS = 'CAR_RETRIEVE_SUCCESS';
export const CAR_RETRIEVE_ERROR = 'CAR_RETRIEVE_ERROR';

export const actionRetrieveCars = () => ({
  type: CAR_RETRIEVE
});

export const selectorCar = state => state.car.cars;

export function carSearchReducer(state = initialState, action: Action) {
  switch (action.type) {
    case CAR_RETRIEVE:
      return Object.assign({}, state, {
        loading: true,
        data: null,
        error: null
      });

    case CAR_RETRIEVE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        data: action.payload,
        error: null
      });

    case CAR_RETRIEVE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        data: null,
        error: action.payload
      });

    default:
      return state;
  }
}

export interface Car {
  "$class": string,
  "id": string,
  "category": string,
  "issuedBy": string,
  "subLot": string,
  "at": string,
  "timestamp": string,
  "description": string
}
