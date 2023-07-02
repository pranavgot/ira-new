import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedWorkspaceComponent } from './extended-workspace.component';

describe('ExtendedWorkspaceComponent', () => {
  let component: ExtendedWorkspaceComponent;
  let fixture: ComponentFixture<ExtendedWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedWorkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
