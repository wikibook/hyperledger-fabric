import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { actionAddCar, actionClearCar, selectorCar } from './car-register.reducer';

import { DetailDialogComponent } from '../detail/detail-dialog.component';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

import { AppService } from '../../app.service';
import {login} from "@app/core";

@Component({
  selector: 'ea-car-register',
  templateUrl: './car-register.component.html',
  styleUrls: ['./car-register.component.scss']
})
export class CarRegisterComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  user = {};
  userId ="";
  newCar = {
    Id:null,
    Name:null,
    OwnerId:null,
    Timestamp:null
  };
  carForm : NgForm;
  COMPANYLIST = this.CONFIG.companyList;
  loading: false;

  constructor(public store: Store<any>,
    public dialog: MatDialog,
    private router: Router,
    private appService: AppService,
    @Inject('Config') private CONFIG: any) {}

  ngOnInit() {
    this.store
      .select(selectorCar)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((payload)=>{
          this.loading = payload.loading;

          if(payload.message){
            payload.data.type = 'success';
            this.openDialog(payload.data);
          }

        },(err) => {
          this.loading = err.loading;
          alert(err.message);
        }
      );

    this.appService.getUser()
      .subscribe(
        // Successful responses call the first callback.
        data => {
          //set user
          this.user = data;
          this.userId = data.id;
        },
        // Errors will call this callback instead:
        err => {
          console.log('Login Error:' + err);
        }
      );

  }

  isReadOnly(): boolean {
    return this.userId !='admin';
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onAddCar() {
    let current = new Date();
    //generate id
    this.newCar.Id = 'Car' + current.getTime();
    this.newCar.Timestamp = current.toISOString();
    this.store.dispatch(actionAddCar(this.newCar));
  }

  openDialog(args): void {
    let dialogRef = this.dialog.open(DetailDialogComponent, {
      width: '350px',
      data: args
    });

    dialogRef.afterClosed().subscribe(result => {
      //clear data
      this.store.dispatch(actionClearCar());
    });
  }
}
