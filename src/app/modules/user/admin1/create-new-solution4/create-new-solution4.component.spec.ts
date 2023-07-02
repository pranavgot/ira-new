import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSolution4Component } from './create-new-solution4.component';

describe('CreateNewSolution4Component', () => {
  let component: CreateNewSolution4Component;
  let fixture: ComponentFixture<CreateNewSolution4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewSolution4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewSolution4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
