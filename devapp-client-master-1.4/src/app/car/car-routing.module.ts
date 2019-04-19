import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarsComponent } from './cars/cars.component';

import { CarSearchComponent } from './search/car-search.component';
import { CarRegisterComponent } from './register/car-register.component';

const routes: Routes = [
  {
    path: '',
    component: CarsComponent,
    children: [
      {
        path: '',
        redirectTo: 'car-search',
        pathMatch: 'full'
      },
      {
        path: 'car-search',
        component: CarSearchComponent,
        data: {
          title: 'CarSearch'
        }
      },
      {
        path: 'car-register',
        component: CarRegisterComponent,
        data: {
          title: 'CarRegister'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule {}
