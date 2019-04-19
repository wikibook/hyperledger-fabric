import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@app/shared';

import { CarRoutingModule } from './car-routing.module';
import { CarsComponent } from './cars/cars.component';
import { DetailDialogComponent } from './detail/detail-dialog.component';
import { CarTransferService } from './detail/car-transfer.service';

import { CarSearchComponent } from './search/car-search.component';
import { carSearchReducer } from './search/car-search.reducer';
import { CarSearchEffects } from './search/car-search.effects';
import { CarSearchService } from './search/car-search.service';

import { CarRegisterComponent } from './register/car-register.component';
import { carRegisterReducer } from './register/car-register.reducer';
import { CarRegisterEffects } from './register/car-register.effects';
import { CarRegisterService } from './register/car-register.service';

@NgModule({
  imports: [
    SharedModule,
    CarRoutingModule,
    StoreModule.forFeature('car', {
      cars: carSearchReducer,
      register: carRegisterReducer
    }),
    EffectsModule.forFeature([CarSearchEffects,CarRegisterEffects])
  ],
  declarations: [
    CarsComponent,
    DetailDialogComponent,
    CarSearchComponent,
    CarRegisterComponent
  ],
  bootstrap: [DetailDialogComponent],
  providers: [CarSearchService,CarRegisterService,CarTransferService]
})
export class CarModule {
  constructor() {}
}
