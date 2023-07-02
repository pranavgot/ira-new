import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInfo2Component } from './client-info2.component';

describe('ClientInfo2Component', () => {
  let component: ClientInfo2Component;
  let fixture: ComponentFixture<ClientInfo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientInfo2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInfo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
