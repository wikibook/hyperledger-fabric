import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';

import { CoreModule } from '@app/core';

import { SettingsModule } from './settings';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { SharedModule } from '@app/shared';


import { HomeComponent } from './home/home.component';

//data
import { staticData } from './shared/static-data';


@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    FormsModule,
    SharedModule,

    SettingsModule,

    // app
    AppRoutingModule,


  ],
  declarations: [AppComponent,HomeComponent],
  providers: [AppService, {provide: 'Config', useValue: staticData}],
  bootstrap: [AppComponent]
})
export class AppModule {}
