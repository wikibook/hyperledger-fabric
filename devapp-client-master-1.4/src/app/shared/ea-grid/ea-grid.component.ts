import { Component, Input,Output,EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid/main.js';

@Component({
  selector: 'ea-grid',
  templateUrl: './ea-grid.component.html',
  styleUrls: ['./ea-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EaGridComponent implements OnInit {

  @Input() gridOptions: GridOptions;
  @Input() columnDefs: any[];
  @Input() rowData: any[];
  @Output() onSelectedRow = new EventEmitter<boolean>();

  private gridApi;

  constructor() {
    //default settings
    this.gridOptions = <GridOptions>{
      rowSelection: 'single',
      rowDeselection: true,
      enableSorting: true,
      enableFilter: true,
      enableColResize: true,
      rowHeight: 40
    };

  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
  }

  onSelectionChanged(){
    this.onSelectedRow.emit(this.gridApi.getSelectedRows());
  }

  selectAllRows() {
    this.gridOptions.api.selectAll();
  }

  ngOnInit() {
  }

}
