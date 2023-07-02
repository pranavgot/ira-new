import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserManagementComponent } from './internal-user-management.component';

describe('InternalUserManagementComponent', () => {
  let component: InternalUserManagementComponent;
  let fixture: ComponentFixture<InternalUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
