import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualSalaryComponent } from './annual-salary.component';

describe('AnnualSalaryComponent', () => {
  let component: AnnualSalaryComponent;
  let fixture: ComponentFixture<AnnualSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
