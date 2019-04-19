import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { SettingsComponent } from './settings';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeComponent,
    data: { title: 'home' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data:
      { title: 'home' }
  },
  {
    path: 'car',
    loadChildren: 'app/car/car.module#CarModule'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    }
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
