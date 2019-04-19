import { Component, OnInit } from '@angular/core';

import { routerTransition } from '@app/core';

@Component({
  selector: 'ea-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  animations: [routerTransition]
})
export class CarsComponent implements OnInit {
  cars = [
    { link: 'car-register', label: 'REGISTER' },
    { link: 'car-search', label: 'TRANSFER' }
  ];

  constructor() {}

  ngOnInit() {}
}
