import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSolution2Component } from './create-new-solution2.component';

describe('CreateNewSolution2Component', () => {
  let component: CreateNewSolution2Component;
  let fixture: ComponentFixture<CreateNewSolution2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewSolution2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewSolution2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
