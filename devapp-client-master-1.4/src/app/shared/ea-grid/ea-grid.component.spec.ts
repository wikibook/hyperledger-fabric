import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EaGridComponent } from './ea-grid.component';

describe('EaGridComponent', () => {
  let component: EaGridComponent;
  let fixture: ComponentFixture<EaGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EaGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EaGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
