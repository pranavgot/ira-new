import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequest2Component } from './service-request2.component';

describe('ServiceRequest2Component', () => {
  let component: ServiceRequest2Component;
  let fixture: ComponentFixture<ServiceRequest2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRequest2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
