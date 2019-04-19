import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';

import { login, logout, selectorAuth, routerTransition } from '@app/core';
import { environment as env } from '@env/environment';

import { selectorSettings } from './settings';

import { AppService } from './app.service';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';

import {
  AUTH_LOGIN,
  AUTH_LOGOUT
} from './core/auth/auth.reducer';

@Component({
  selector: 'ea-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @HostBinding('class') componentCssClass;

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../assets/note.png');
  navigation = [
    { link: 'home', label: 'Home' },
    { link: 'car', label: 'Car' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: '設定' }
  ];
  isAuthenticated;
  user = {};

  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<any>,
    private router: Router,
    private titleService: Title,
    private service: AppService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectorSettings)
      .pipe(
        takeUntil(this.unsubscribe$),
        map(({ theme }) => theme.toLowerCase())
      )
      .subscribe(theme => {
        this.componentCssClass = theme;
        this.overlayContainer.getContainerElement().classList.add(theme);
      });
    this.store
      .select(selectorAuth)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(auth => (this.isAuthenticated = auth.isAuthenticated));
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        let lastChild = event.snapshot;
        while (lastChild.children.length) {
          lastChild = lastChild.children[0];
        }
        const { title } = lastChild.data;
        this.titleService.setTitle(
          title ? `${title} - ${env.appName}` : env.appName
        );
      });

    this.onLoginClick()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoginClick() {
    this.service.getUser()
    .subscribe(
      // Successful responses call the first callback.
      data => {
        this.store.dispatch(login());
        //set user
        this.user = data;

        //set theme per type
        let theme = 'DEFAULT-THEME';
        switch(data.role) {
           case "RETAILER": {
              theme = 'BLACK-THEME';
              break;
           }
           case "WHOLESALER": {
              theme = 'LIGHT-THEME';
              break;
           }
           case "MANUFACTURER": {
              theme = 'DEFAULT-THEME';
              break;
           }
        }
        theme = theme.toLowerCase();
        this.componentCssClass = theme;
        this.overlayContainer.getContainerElement().classList.add(theme);
      },
      // Errors will call this callback instead:
      err => {
        console.log('Login Error:' + err);
      }
    );
  }

  onLogoutClick() {
    this.store.dispatch(logout());
    //then request and server send 401
    this.service.logout()
    .subscribe(
      // Successful responses call the first callback.
      data => {
      //NOP always 401
      },
      // Errors will call this callback instead:
      err => {
        console.log('Logouted');
      }
    );
  }
}
