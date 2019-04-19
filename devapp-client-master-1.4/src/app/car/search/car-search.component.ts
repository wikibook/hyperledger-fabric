import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';

import { actionRetrieveCars, selectorCar } from './car-search.reducer';

import { DetailDialogComponent } from '../detail/detail-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'ea-car-search',
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.scss']
})
export class CarSearchComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  initialized;
  cars;

  gridOptions: GridOptions;
  columnDefs: any[];
  rowData: any[];

  private gridApi;
  private gridColumnApi;
  private rowSelection;

  constructor(public store: Store<any>, public dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.initialized = false;
    this.store
      .select(selectorCar)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cars: any) => {
        console.log('store.subscribe'+JSON.stringify(cars));
        this.cars = cars;
        this.rowData = cars.data;

        if (!this.initialized) {
          this.initialized = true;
          this.store.dispatch(actionRetrieveCars());
        }
      });

    this.columnDefs = [
        {headerName: "ID", field: "Id"},
        {headerName: "名称", field: "Name"},
        {headerName: "オーナー", field: "OwnerId"},
        {headerName: "タイムスタンプ", field: "Timestamp"}
    ];

    let self = this;
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true,
      enableColResize: true,
      rowSelection: 'single',
      rowHeight: 40,
      onGridReady: function(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
      },
      onSelectionChanged: function(){
        var selectedRows = this.gridApi.getSelectedRows();
        var selectedRowsString = "";
        selectedRows.forEach(function(selectedRow, index) {
          if (index !== 0) {
            selectedRowsString += ", ";
          }
          selectedRowsString += selectedRow.id;
        });
        console.log('***' + selectedRowsString);
        //get first row
        self.openDialog(selectedRows[0]);
      }
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRefreshGrid(): void {
    this.store.dispatch(actionRetrieveCars());
  }

  openDialog(args): void {
    let dialogRef = this.dialog.open(DetailDialogComponent, {
      width: '350px',
      data: args
    });

    dialogRef.afterClosed().subscribe(result => {
      //refresh
      this.onRefreshGrid();
    });
  }
}
