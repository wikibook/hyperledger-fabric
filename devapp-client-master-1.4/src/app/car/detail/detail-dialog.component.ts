import {Component, Inject} from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { CarTransferService } from './car-transfer.service';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss']
})
export class DetailDialogComponent {
  COMPANYLIST = this.CONFIG.companyList;

  constructor(
    public dialogRef: MatDialogRef<DetailDialogComponent>,
    private service: CarTransferService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject('Config') private CONFIG: any) { }

  isReadOnly(): boolean {
    return this.data.type === 'success' || this.data.type === 'transfer';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onTransfer(): void {
    this.service.transfer(this.data)
    .subscribe(
    data => {
      console.log('Transfer is accepted.');
      this.data.type = 'transfer'
    },
    err => {
      console.log('Error!:' + err);
    });
  }

}
